"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Cpu, Zap, Shield, ArrowRight, Sparkles, Activity } from "lucide-react";
import Scene3D from "@/components/Scene3D";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  },
};

export default function LandingPage() {
  const features = [
    { icon: <Zap className="text-indigo-400" />, title: "Quantum Speed", desc: "Powered by Qwen 3 neural architecture for sub-second synthesis." },
    { icon: <Shield className="text-indigo-400" />, title: "Neural Security", desc: "Encrypted processing kernels ensure data integrity and privacy." },
    { icon: <Activity className="text-indigo-400" />, title: "Adaptive Logic", desc: "Real-time learning algorithms that evolve with your workspace." },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden relative">
      <Scene3D />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-indigo-600/20 backdrop-blur-xl p-2.5 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <Cpu size={32} className="text-indigo-400" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white uppercase">M.A.R.K</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 items-center"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">System Nominal</span>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16 pb-32 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-12">
            <Sparkles size={14} /> The Future of Intelligence
          </motion.div>
          
          <motion.h1 variants={item} className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.85]">
            NEURAL <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-800">
              EVOLUTION
            </span>
          </motion.h1>

          <motion.p variants={item} className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-16 px-4">
            Command the most advanced Qwen-powered research kernel. 
            Designed for high-stakes intelligence and creative synthesis.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/chat" className="group relative bg-white text-black px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3">
              INITIALIZE KERNEL
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Features */}
      <section className="relative z-10 px-8 py-20 max-w-7xl mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={item}
              className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] transition-all hover:border-indigo-500/20"
            >
              <div className="mb-8 p-4 bg-indigo-500/10 w-fit rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-20 text-center border-t border-white/5 bg-black/50 backdrop-blur-3xl mt-20">
        <p className="text-slate-600 text-[10px] font-black tracking-[0.5em] uppercase">
          © 2026 M.A.R.K • Neural Systems • V1.2.0
        </p>
      </footer>
    </div>
  );
}