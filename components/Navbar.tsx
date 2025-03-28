"use client";

import { ArrowLeft, ArrowRight, Link2, Search, HelpCircle } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-14 border-b border-gray-800 flex items-center px-4 bg-[#1a1a1a] text-white">
      <div className="flex items-center space-x-4">
        <ArrowLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        <ArrowRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        <Link2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
      </div>
      
      <div className="flex-1 mx-4 flex items-center">
        <input
          type="text"
          defaultValue="Project Name"
          className="bg-transparent border-none outline-none text-blue-500 font-medium"
        />
        <div className="flex items-center ml-auto space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Save your project for later —</span>
          <button className="text-blue-500 text-sm hover:underline">sign up</button>
          <span className="text-gray-400">or</span>
          <button className="text-blue-500 text-sm hover:underline">log in</button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Upgrade
        </button>
        <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Done
        </button>
      </div>
    </div>
  );
}