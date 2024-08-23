"use client";

import { useOthers } from "@liveblocks/react/suspense";

export function CollaborativeApp() {
  const others = useOthers();
  const userCount = others.length;
  return (<div>
    
    There are {userCount} other user(s) online
    <h1 className="font-xl text-red-500">
      Hello there
    </h1>
    
    </div>);
}