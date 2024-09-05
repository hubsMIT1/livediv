// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data

import { createClient, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey:process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
})

export type ThreadMetadata = {
  resolved: boolean;
  zIndex: number;
  time?: number;
  x: number;
  y: number;
};

type Presence = {
  // cursor: { x: number, y: number } | null,
  // ...
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  // author: LiveObject<{ firstName: string, lastName: string }>,
  // ...
  canvasObjects: LiveMap<string, any>;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
type UserMeta = {
  // id?: string,  // Accessible through `user.id`
  // info?: Json,  // Accessible through `user.info`
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} =  createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);
// declare global {
//   interface Liveblocks {
//     // Each user's Presence, for useMyPresence, useOthers, etc.
//     Presence: {
//       // Example, real-time cursor coordinates
//       // cursor: { x: number; y: number };
//     };

//     // The Storage tree for the room, for useMutation, useStorage, etc.
//     Storage: {
//       // Example, a conflict-free list
//       // animals: LiveList<string>;
//     };

//     // Custom user info set when authenticating with a secret key
//     UserMeta: {
//       id: string;
//       info: {
//         // Example properties, for useSelf, useUser, useOthers, etc.
//         // name: string;
//         // avatar: string;
//       };
//     };

//     // Custom events, for useBroadcastEvent, useEventListener
//     RoomEvent: {};
//       // Example has two events, using a union
//       // | { type: "PLAY" } 
//       // | { type: "REACTION"; emoji: "🔥" };

//     // Custom metadata set on threads, for useThreads, useCreateThread, etc.
//     ThreadMetadata: {
//       // Example, attaching coordinates to a thread
//       // x: number;
//       // y: number;
//     };

//     // Custom room info set with resolveRoomsInfo, for useRoomInfo
//     RoomInfo: {
//       // Example, rooms with a title and url
//       // title: string;
//       // url: string;
//     };
//   }
// }

// export {};
