"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Cpu, Sparkles, ChevronLeft, Globe, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "M.A.R.K online. All neural pathways synchronized. Ready for instruction.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text) return;

    const newUserMessage: Message = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `ERROR: ${error.message || "Uplink interrupted."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-black text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* HUD Header */}
      <nav className="border-b border-white/5 px-8 py-6 flex items-center justify-between bg-black/50 backdrop-blur-3xl sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="group p-2.5 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse" />
              <div className="relative bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Cpu size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter text-white uppercase">M.A.R.K</h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Secure Link</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2 text-slate-500">
            <Globe size={14} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Global Node: 01</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-4 py-1.5 rounded-full">
            <Terminal size={14} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Qwen 3 Kernel</span>
          </div>
        </div>
      </nav>

      {/* Main Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.03),transparent)]">
        <div className="max-w-5xl mx-auto w-full">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ChatMessage message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 flex gap-8 items-start"
            >
              <div className="relative h-10 w-10 shrink-0">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur animate-pulse opacity-40" />
                <div className="relative h-full w-full bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-indigo-600/20 animate-[bounce_1.5s_infinite]" />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="h-2 bg-white/5 rounded-full w-1/4 animate-pulse" />
                <div className="h-2 bg-white/5 rounded-full w-1/3 animate-pulse delay-75" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-10" />
        </div>
      </div>

      {/* HUD Input Bar */}
      <div className="bg-black/80 backdrop-blur-3xl border-t border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </main>
  );
}