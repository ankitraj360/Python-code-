'use client';

import { useState } from 'react';
import Scene from '@/components/three/Scene';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/ui/Footer';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setError(null);

    let targetUrl = url.trim();
    
    // Auto-fix missing protocol
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    // Basic regex for domain validation
    const domainRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    if (!domainRegex.test(targetUrl)) {
      setError('Please enter a valid website URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('lastAnalysis', JSON.stringify(data.data));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to connect to server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-32 px-4">
      <Scene />
      
      {/* Hero Section */}
      <div className="z-10 text-center max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase glass rounded-full text-neon-blue">
            AI-Powered Website Intelligence
          </span>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
            SiteScope <span className="text-gradient">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Paste your URL. Get a professional 3D analysis of your UX, SEO, and Performance in seconds.
          </p>
        </motion.div>

        {/* URL Input Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-2xl mx-auto w-full mb-20"
        >
          <form onSubmit={handleAnalyze} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-black rounded-2xl border border-white/10 p-2 overflow-hidden">
              <Search className="ml-4 text-white/40" size={24} />
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                required
                className="flex-1 bg-transparent border-none focus:ring-0 text-white p-4 text-lg outline-none placeholder:text-white/20"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
              />
              <button
                disabled={isLoading}
                className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Analyze <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <Footer />
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] -z-20 animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] -z-20 animate-pulse" />
    </main>
  );
}
