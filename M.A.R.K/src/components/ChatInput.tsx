import React, { useState, useRef, useEffect } from "react";
import { Zap, Mic, MicOff, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          setInput((prev) => {
            const separator = prev.length > 0 && !prev.endsWith(" ") ? " " : "";
            return prev + separator + transcript;
          });
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isListening) recognitionRef.current?.stop();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
        
        <div className="relative flex flex-col gap-2 bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[2rem] p-3 shadow-2xl transition-all group-focus-within:border-indigo-500/30">
          
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-4 rounded-2xl transition-all ${
                isListening 
                  ? "bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                  : "text-slate-500 hover:text-indigo-400 hover:bg-white/5"
              }`}
            >
              {isListening ? <MicOff size={24} className="animate-pulse" /> : <Mic size={24} />}
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening for neural input..." : "Type a command or use voice..."}
              className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-white placeholder:text-slate-600 resize-none max-h-60 min-h-[56px] text-lg font-medium"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={disabled}
            />

            <div className="flex items-center gap-3 p-2">
               <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 <Command size={10} />
                 <span>Enter</span>
               </div>
               
               <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="p-4 bg-white text-black rounded-2xl hover:bg-indigo-50 disabled:opacity-10 disabled:grayscale transition-all shadow-xl active:scale-95"
              >
                <Zap size={24} className={disabled ? "" : "fill-current"} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center gap-8">
           <div className="flex items-center gap-2">
             <div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_5px_indigo]" />
             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Biometric Auth: Active</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_5px_indigo]" />
             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Neural Encryption: AES-256</span>
           </div>
        </div>
      </form>
    </div>
  );
}