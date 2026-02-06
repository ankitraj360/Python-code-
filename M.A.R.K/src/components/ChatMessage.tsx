import React from "react";
import ReactMarkdown from "react-markdown";
import { User, Cpu, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full py-12 px-6 md:px-16 gap-8 transition-all border-b border-white/[0.03]",
        isAssistant ? "bg-white/[0.01]" : "bg-transparent"
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all shadow-2xl",
            isAssistant 
              ? "bg-indigo-600 border-indigo-400/30 text-white shadow-indigo-500/20" 
              : "bg-slate-900 border-white/10 text-slate-400"
          )}
        >
          {isAssistant ? <Cpu size={24} /> : <User size={24} />}
        </div>
        {isAssistant && (
           <div className="flex items-center gap-1 text-[8px] font-black text-indigo-500 uppercase tracking-widest">
             <ShieldCheck size={10} />
             Verified
           </div>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-hidden pt-1">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-[10px] font-black uppercase tracking-[0.3em]",
            isAssistant ? "text-indigo-400" : "text-slate-500"
          )}>
            {isAssistant ? "M.A.R.K Neural Kernel" : "Authorized Operator"}
          </p>
          <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">
            TS: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="prose prose-invert prose-indigo max-w-none 
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-white prose-strong:font-black
          prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-2xl">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
