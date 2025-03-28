"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [mediaElement, setMediaElement] = useState<{
    type: "video" | "image";
    file: File | null;
    width: number;
    height: number;
    position: { x: number; y: number };
    startTime: number;
    endTime: number;
  }>({
    type: "video",
    file: null,
    width: 640,
    height: 360,
    position: { x: 0, y: 0 },
    startTime: 0,
    endTime: 10,
  });

  return (
    <main className="flex flex-col h-screen bg-[#1a1a1a]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          mediaElement={mediaElement} 
          setMediaElement={setMediaElement} 
        />
        <Editor 
          mediaElement={mediaElement} 
          setMediaElement={setMediaElement} 
        />
      </div>
    </main>
  );
}