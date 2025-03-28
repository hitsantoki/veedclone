"use client";

import { Upload, Video, Music, Subtitles, Type, Image, Settings, Mic, Wand2 } from "lucide-react";
import { ChangeEvent } from "react";

interface SidebarProps {
  mediaElement: {
    type: "video" | "image";
    file: File | null;
    width: number;
    height: number;
    position: { x: number; y: number };
    startTime: number;
    endTime: number;
  };
  setMediaElement: (mediaElement: any) => void;
}

export default function Sidebar({ mediaElement, setMediaElement }: SidebarProps) {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaElement({
        ...mediaElement,
        file,
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }
  };

  const sidebarItems = [
    { icon: Video, label: "Video", active: true },
    { icon: Music, label: "Audio" },
    { icon: Subtitles, label: "Subtitles" },
    { icon: Type, label: "Text" },
    { icon: Image, label: "Elements" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-[300px] bg-[#1a1a1a] border-r border-gray-800 text-white flex">
      <div className="w-16 bg-[#141414] flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black font-bold">V</span>
        </div>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg cursor-pointer ${
              item.active ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <item.icon className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
      
      <div className="flex-1 p-4">
        <h2 className="text-lg font-medium mb-4">Add Media</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept="video/*,image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Upload a file</p>
              <p className="text-xs text-gray-500">or drag & drop</p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center space-x-2 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333]">
              <Mic className="w-5 h-5 text-gray-400" />
              <span className="text-sm">Record</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333]">
              <Wand2 className="w-5 h-5 text-gray-400" />
              <span className="text-sm">Brand Kits</span>
            </button>
          </div>

          {mediaElement.file && (
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium">Media Properties</h3>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Width</label>
                <input
                  type="number"
                  value={mediaElement.width}
                  onChange={(e) => setMediaElement({
                    ...mediaElement,
                    width: Number(e.target.value)
                  })}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">Height</label>
                <input
                  type="number"
                  value={mediaElement.height}
                  onChange={(e) => setMediaElement({
                    ...mediaElement,
                    height: Number(e.target.value)
                  })}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">Start Time (seconds)</label>
                <input
                  type="number"
                  value={mediaElement.startTime}
                  onChange={(e) => setMediaElement({
                    ...mediaElement,
                    startTime: Number(e.target.value)
                  })}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">End Time (seconds)</label>
                <input
                  type="number"
                  value={mediaElement.endTime}
                  onChange={(e) => setMediaElement({
                    ...mediaElement,
                    endTime: Number(e.target.value)
                  })}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-2 py-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}