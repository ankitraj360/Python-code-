'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Search, 
  Accessibility, 
  TrendingUp,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RadarChart } from '@/components/ui/RadarChart';
import Chatbot from '@/components/ui/Chatbot';

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const refId = useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), []);

  useEffect(() => {
    const saved = sessionStorage.getItem('lastAnalysis');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.scores) {
          setAnalysis(parsed);
        } else {
          setHasError(true);
        }
      } catch (e) {
        console.error("Failed to parse analysis data", e);
        setHasError(true);
      }
    } else {
      // If no data found after a short delay, show error
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem('lastAnalysis')) {
          setHasError(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full mb-6 flex items-center justify-center border border-red-500/50">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Analysis Data Missing</h2>
        <p className="text-white/60 mb-8 max-w-md">
          We couldn&apos;t find your analysis results. This can happen if you refresh the page or navigate directly here.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-neon-blue transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  if (!analysis || !analysis.scores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-neon-blue rounded-full mb-4 shadow-[0_0_20px_rgba(0,242,255,0.5)]" />
          <p className="text-white/40 tracking-widest uppercase text-xs">Calibrating Analysis...</p>
        </div>
      </div>
    );
  }

  const scores = analysis.scores;
  const scoreItems = [
    { label: 'Technical', value: scores.technical || 0, icon: Zap, color: 'text-yellow-400' },
    { label: 'SEO', value: scores.seo || 0, icon: Search, color: 'text-green-400' },
    { label: 'Content', value: scores.content || 0, icon: ShieldCheck, color: 'text-blue-400' },
    { label: 'UX', value: scores.ux || 0, icon: Accessibility, color: 'text-purple-400' },
    { label: 'Conversion', value: scores.conversion || 0, icon: TrendingUp, color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 md:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <Link href="/" className="flex items-center text-white/40 hover:text-white mb-4 transition-colors group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Audit
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Analysis <span className="text-neon-blue">Report</span>
            </h1>
            <p className="text-white/60 mt-2 font-mono text-sm tracking-tighter">REF_ID: {refId}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const chatbotToggle = document.querySelector('[data-chatbot-toggle]') as HTMLButtonElement;
                if (chatbotToggle) chatbotToggle.click();
              }}
              className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold tracking-widest uppercase hover:bg-neon-blue transition-all"
            >
              Chat with AI
            </button>
            <div className="px-4 py-2 bg-neon-blue/10 text-neon-blue rounded-full text-xs font-bold tracking-widest uppercase border border-neon-blue/20 hidden md:block">
              Verified Analysis
            </div>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overall Score & Metrics */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-neon-blue/5 group-hover:bg-neon-blue/10 transition-colors" />
              <h3 className="text-lg font-medium text-white/60 mb-8">Overall Rating</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48">
                  <circle
                    className="text-white/5"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="86"
                    cx="96"
                    cy="96"
                  />
                  <motion.circle
                    className="text-neon-blue"
                    strokeWidth="12"
                    strokeDasharray={540}
                    initial={{ strokeDashoffset: 540 }}
                    animate={{ strokeDashoffset: 540 - (540 * (analysis.overallRating || 0)) / 10 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="86"
                    cx="96"
                    cy="96"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black">{analysis.overallRating || 0}</span>
                  <span className="text-white/40 text-sm uppercase tracking-widest">Score / 10</span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-3xl font-bold text-neon-purple">{analysis.startupReadinessScore || 0}%</div>
                <div className="text-xs uppercase tracking-tighter text-white/40">Startup Readiness Score</div>
              </div>
            </motion.div>

            {/* Improvement Probabilities */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-8 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-6 text-neon-blue">Growth Potential</h3>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Ranking Probability</span>
                    <span className="text-neon-blue font-mono font-bold">{Math.round((analysis.probabilities?.rankingImprovement || 0) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(analysis.probabilities?.rankingImprovement || 0) * 100}%` }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                    />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Conversion Lift</span>
                    <span className="text-neon-purple font-mono font-bold">{Math.round((analysis.probabilities?.conversionImprovement || 0) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(analysis.probabilities?.conversionImprovement || 0) * 100}%` }}
                      className="h-full bg-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-3xl"
            >
              <h3 className="text-xl font-bold mb-6 text-neon-purple">Signal Analysis</h3>
              <RadarChart scores={scores} />
            </motion.div>
          </div>

          {/* Right Column: Insights & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Technical Deep Dive */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="glass p-8 rounded-3xl border-neon-blue/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Technical Architecture</h3>
                <div className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-3 py-1 rounded-full">
                  Modernity: {analysis.technicalDeepDive?.modernityScore || 0}%
                </div>
              </div>
              <p className="text-sm text-white/70 mb-6 leading-relaxed">
                {analysis.technicalDeepDive?.architecture}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Potential Bottlenecks</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.technicalDeepDive?.potentialBottlenecks?.map((item: string) => (
                      <span key={item} className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metrics List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {scoreItems.map((item) => (
                <div key={item.label} className="glass p-4 rounded-2xl text-center">
                  <item.icon className={cn("w-6 h-6 mx-auto mb-2", item.color)} />
                  <div className="text-xs text-white/40 uppercase tracking-tighter mb-1">{item.label}</div>
                  <div className="text-xl font-bold">{item.value}%</div>
                </div>
              ))}
            </motion.div>

            {/* Founder Summary */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-[10px] font-black uppercase tracking-widest rounded-full">AI Executive Summary</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Founder Summary</h3>
              <p className="text-lg text-white/80 leading-relaxed italic">
                "{analysis.founderSummary}"
              </p>
            </div>

            {/* Quick Wins & Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl border-neon-blue/10">
                <div className="flex items-center gap-2 mb-6 text-neon-blue">
                  <Zap size={24} />
                  <h3 className="text-xl font-bold">Quick Wins</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.quickWins?.map((win: string, i: number) => (
                    <li key={i} className="flex gap-3 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                      {win}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass p-8 rounded-3xl border-neon-purple/10">
                <div className="flex items-center gap-2 mb-6 text-neon-purple">
                  <TrendingUp size={24} />
                  <h3 className="text-xl font-bold">Long-term Roadmap</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.longTermRoadmap?.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Improvements */}
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-8">Strategy & Execution</h3>
              <div className="space-y-4">
                {analysis.improvements?.map((imp: any, i: number) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-neon-blue/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          imp.priority === 'High' ? 'bg-red-500' : imp.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        )} />
                        <span className="text-white/90 font-bold uppercase">{imp.task}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                        imp.priority === 'High' ? 'bg-red-500/20 text-red-500' : imp.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                      )}>
                        {imp.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{imp.reason}</p>
                    <div className="text-[10px] uppercase tracking-tighter text-neon-blue">Expected Impact: {imp.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Chatbot analysisContext={analysis} />
    </div>
  );
}
