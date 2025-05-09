"use client";
import { useEffect, useState } from "react";

export default function Chatbot() {
  return (
    <div className="fixed bottom-4 right-4 w-[384px] h-[640px] overflow-hidden z-50">
      <iframe
        src="/chatbot.html"
        width="100%"
        height="100%"
        title="Dify Chatbot"
      />
    </div>
  );
}
