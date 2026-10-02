"use client";
import { MessageCircle } from "lucide-react";
export default function ChatOpen() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("t2-chat-open"))} aria-label="Chat and book" className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-brand bg-white px-3 py-2 text-xs font-extrabold text-brand transition active:scale-95"><MessageCircle className="h-4 w-4" />Chat &amp; book</button>
  );
}
