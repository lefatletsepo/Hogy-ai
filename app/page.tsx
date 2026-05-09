"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Copy, Check, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDistill = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.prompt);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neon-cyan text-xs font-medium"
        >
          <Sparkles size={14} />
          <span>New: Gemini 1.5 Flash Distillation</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple via-white to-neon-cyan">
            Hogy AI
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          Distill any website into a high-quality AI prompt in seconds.
        </motion.p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 pr-4 py-4 placeholder:text-white/20"
          />
        </div>
        <button
          onClick={handleDistill}
          disabled={loading || !url}
          className={cn(
            "w-full md:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
            loading || !url 
              ? "bg-white/5 text-white/30 cursor-not-allowed" 
              : "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Distilling...</span>
            </>
          ) : (
            <>
              <span>Distill URL</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="mt-12 space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest">Distilled Prompt</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-xs font-bold text-neon-cyan hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-50" />
              <pre className="text-white/80 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
                {result}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
