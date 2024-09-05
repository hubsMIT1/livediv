'use client'
import Navbar from "@/components/Navbar";
// import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";
import Live from "@/components/Live";
import LeftSidebar from "@/components/LeftSideBar";
import RightSidebar from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
// import { useMutation } from "@liveblocks/react";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectMoving, handleCanvasObjectScaling, handleCanvasSelectionCreated, handleCanvasZoom, handlePathCreated, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { ActiveElement, Attributes } from "@/types/type";
import {fabric} from 'fabric';
import { availableMemory } from "process";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleImageUpload } from "@/lib/shapes";
export default function Page() {
  
  const undo = useUndo()
  const redo = useRedo()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);

  const canvasObjects = useStorage((root)=>root.canvasObjects)

  const syncShapeInStorage = useMutation(({storage},object)=>{
      if(!object)return;

      const {objectId} =object
      const shapeData = object.toJSON();
      shapeData.objectId = objectId;

      const convasObjects = storage.get('canvasObjects');
      convasObjects.set(objectId,shapeData);


  },[])

  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const deleteAllShapes = useMutation(({storage})=>{

    const canvasObjects = storage.get('canvasObjects');

    if(!canvasObjects || canvasObjects.size === 0)
      return true;
    for (const [key,value] of canvasObjects.entries() as any){
      canvasObjects.delete(key);

    }
    return canvasObjects.size ===0 ;
  },[])
  const deleteShapeFromStorage = useMutation(({storage},objectId)=>{
    const canvasObjects = storage.get('canvasObjects');
    
    canvasObjects.delete(objectId)
  },[])
  const handleActiveElement = (elem:ActiveElement) =>{
    setActiveElement(elem);
    switch(elem?.value){
      case 'reset':
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement)
        break;
      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break;
      case 'image':
        imageInputRef.current?.click();
        isDrawing.current=false;

        if(fabricRef.current){
          fabricRef.current.isDrawingMode= false;
        }
        break;
      default:
        break;

    }
    selectedShapeRef.current = elem?.value as string
  } 
  // const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
  //   /**
  //    * canvasObjects is a Map that contains all the shapes in the key-value.
  //    * Like a store. We can create multiple stores in liveblocks.
  //    *
  //    * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
  //    */
  //   const canvasObjects = storage.get("canvasObjects");
  //   canvasObjects.delete(shapeId);
  // }, []);


  useEffect(() => {
    // initialize the fabric canvas
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    /**
     * listen to the mouse down event on the canvas which is fired when the
     * user clicks on the canvas
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    /**
     * listen to the mouse move event on the canvas which is fired when the
     * user moves the mouse on the canvas
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
    //  */
    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    /**
     * listen to the mouse up event on the canvas which is fired when the
     * user releases the mouse on the canvas
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    /**
     * listen to the path created event on the canvas which is fired when
     * the user creates a path on the canvas using the freeform drawing
     * mode
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    // canvas.on("path:created", (options) => {
    //   handlePathCreated({
    //     options,
    //     syncShapeInStorage,
    //   });
    // });

    /**
     * listen to the object modified event on the canvas which is fired
     * when the user modifies an object on the canvas. Basically, when the
     * user changes the width, height, color etc properties/attributes of
     * the object or moves the object on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    /**
     * listen to the object moving event on the canvas which is fired
     * when the user moves an object on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      });
    });

    /**
     * listen to the selection created event on the canvas which is fired
     * when the user selects an object on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    /**
     * listen to the scaling event on the canvas which is fired when the
     * user scales an object on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    /**
     * listen to the mouse wheel event on the canvas which is fired when
     * the user scrolls the mouse wheel on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    // canvas.on("mouse:wheel", (options) => {
    //   handleCanvasZoom({
    //     options,
    //     canvas,
    //   });
    // });

    /**
     * listen to the resize event on the window which is fired when the
     * user resizes the window.
     *
     * We're using this to resize the canvas when the user resizes the
     * window.
     */
    window.addEventListener("resize", () => {
      handleResize({
        canvas:fabricRef.current
      });
    });

    /**
     * We're using this to perform some actions like delete, copy, paste, etc when the user presses the respective keys on the keyboard.
     * listen to the key down event on the window which is fired when the
     * user presses a key on the keyboard.
     *
     */
    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );

    // dispose the canvas and remove the event listeners when the component unmounts
    return () => {
      /**
       * dispose is a method provided by Fabric that allows you to dispose
       * the canvas. It clears the canvas and removes all the event
       * listeners
       *
       * dispose: http://fabricjs.com/docs/fabric.Canvas.html#dispose
       */
      canvas.dispose();

      // remove the event listeners
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });

      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        })
      );
    };

}, [canvasRef]); 
   
  useEffect(()=>{
    renderCanvas({fabricRef,canvasObjects,activeObjectRef})
  },[canvasObjects])
  return (
    // <Room>
    //   <CollaborativeApp />
    // </Room>
    <main className="h-screen overflow-hidden">
      <Navbar 
       activeElement={activeElement}
       handleActiveElement={handleActiveElement}
       imageInputRef={imageInputRef}
       handleImageUpload={(e:any)=>{
        e.stopPropagation();

        handleImageUpload({
          file:e.target.files[0],
          canvas:fabricRef as any,
          shapeRef,
          syncShapeInStorage,
        })
       }}
      />
      <section className="flex h-full flex-row">
      <LeftSidebar allShapes={Array.from(canvasObjects)}/>
      <Live canvasRef={canvasRef} />
      <RightSidebar 
      isEditingRef={isEditingRef} setElementAttributes={setElementAttributes}
      fabricRef={fabricRef}
      activeObjectRef={activeObjectRef}
      syncShapeInStorage={syncShapeInStorage}
      elementAttributes={elementAttributes}
      />
      </section>
    </main>
  );
}