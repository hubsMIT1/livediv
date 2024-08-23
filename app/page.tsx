'use client'
import Navbar from "@/components/Navbar";
// import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";
import Live from "@/components/Live";

export default function Page() {
  return (
    // <Room>
    //   <CollaborativeApp />
    // </Room>
    <main className="h-screen overflow-hidden">
      <Navbar />
      <section className="flex h-full flex-row">

      <Live />
      </section>
    </main>
  );
}