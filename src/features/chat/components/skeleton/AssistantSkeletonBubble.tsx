"use client";

import React from "react";

export default function AssistantSkeletonBubble() {
  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-white/10 text-foreground rounded-bl-sm">
        <div className="font-bold text-sm mb-1">MCP HUB Assistant</div>
        <div className="flex items-center space-x-1 py-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}


