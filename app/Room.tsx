"use client";
import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense';
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/Loader";

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!} >
    {/* // {"pk_dev_LCFxRFLjukvmD2LvM27rX1cw8NPRnEKz4eafMDpegIt8hx-LZxju-PLFUqmXT-jN"} */}
      <RoomProvider id="my-room" initialPresence={{
        cursor:null, cursorColor:null,edtingText:null
      }}
      initialStorage={{
        canvasObjects:  new LiveMap()
      }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}