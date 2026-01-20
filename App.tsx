
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileUp, BookOpen, AlertCircle, CheckCircle2, Loader2, Sparkles, Github } from 'lucide-react';
import { WordData, ReaderState } from './types';
import { tokenizeText, calculateDelay } from './utils/textProcessor';
import { extractTextFromPdf } from './services/geminiService';
import WordDisplay from './components/WordDisplay';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [state, setState] = useState<ReaderState>(ReaderState.IDLE);
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpm] = useState(350);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    setState(ReaderState.LOADING);
    setError(null);
    setFileName(file.name);

    try {
      const text = await extractTextFromPdf(file);
      const tokenized = tokenizeText(text);
      
      if (tokenized.length === 0) {
        throw new Error("No readable text found in this document.");
      }

      setWords(tokenized);
      setCurrentIndex(0);
      setState(ReaderState.READY);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setState(ReaderState.ERROR);
    }
  };

  const nextWord = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= words.length - 1) {
        setState(ReaderState.PAUSED);
        return prev;
      }
      return prev + 1;
    });
  }, [words.length]);

  useEffect(() => {
    if (state === ReaderState.PLAYING && currentIndex < words.length) {
      const currentWord = words[currentIndex].original;
      const baseDelay = 60000 / wpm;
      const delay = calculateDelay(currentWord, baseDelay);

      timerRef.current = window.setTimeout(nextWord, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state, currentIndex, wpm, words, nextWord]);

  const togglePlay = () => {
    if (state === ReaderState.PLAYING) {
      setState(ReaderState.PAUSED);
    } else if (state === ReaderState.READY || state === ReaderState.PAUSED) {
      setState(ReaderState.PLAYING);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setState(ReaderState.PAUSED);
  };

  const handleSeek = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, words.length - 1)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:rotate-12 transition-transform">
              <Zap className="text-white fill-current" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Velocity<span className="text-red-500">Reader</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {state === ReaderState.IDLE || state === ReaderState.ERROR ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Read documents at <span className="text-red-500 underline decoration-red-500/30">warp speed</span>.
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Upload your PDF, let Gemini extract the intelligence, and consume content 3x faster using the science of RSVP reading.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/50 hover:bg-slate-900 hover:border-red-500/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-slate-800 rounded-2xl mb-4 text-red-500">
                    <FileUp size={48} />
                  </div>
                  <p className="mb-2 text-xl font-semibold text-white">Drop your PDF here</p>
                  <p className="text-sm text-slate-500">or click to browse from your device</p>
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/50 rounded-xl text-red-400 animate-shake">
                <AlertCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 pt-8">
              {[
                { icon: <Sparkles className="text-yellow-500" />, title: "Gemini Powered", desc: "Advanced AI text extraction ensures reading order is preserved perfectly." },
                { icon: <Zap className="text-red-500" />, title: "ORP Highlighting", desc: "Scientific focus point algorithm centers your vision for maximum retention." },
                { icon: <BookOpen className="text-blue-500" />, title: "Adaptive Speed", desc: "Dynamic pacing that slows down for complex punctuation and long words." }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : state === ReaderState.LOADING ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse" size={32} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Gemini is reading...</h3>
              <p className="text-slate-400 animate-pulse italic">"Extracting every word from {fileName}..."</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">{fileName}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{words.length} Words extracted</p>
                </div>
              </div>
              <button 
                onClick={() => setState(ReaderState.IDLE)}
                className="text-sm font-semibold text-slate-400 hover:text-white underline underline-offset-4"
              >
                Upload different file
              </button>
            </div>

            <div className="space-y-10">
              <WordDisplay word={words[currentIndex]} />
              
              <Controls 
                wpm={wpm}
                setWpm={setWpm}
                isPlaying={state === ReaderState.PLAYING}
                onTogglePlay={togglePlay}
                onReset={handleReset}
                progress={(currentIndex / words.length) * 100}
                currentIndex={currentIndex}
                totalWords={words.length}
                onSeek={handleSeek}
              />
            </div>

            <div className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800/50">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Reading Context</h4>
              <div className="text-lg text-slate-400 leading-relaxed font-serif max-h-40 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700">
                {words.slice(Math.max(0, currentIndex - 20), currentIndex).map((w, i) => (
                  <span key={i} className="opacity-40">{w.original} </span>
                ))}
                <span className="text-red-500 font-bold bg-red-500/10 px-1 rounded ring-1 ring-red-500/30 mx-1">{words[currentIndex]?.original}</span>
                {words.slice(currentIndex + 1, currentIndex + 50).map((w, i) => (
                  <span key={i}>{w.original} </span>
                ))}
                <span className="text-slate-700">...</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm">
          Built with <span className="text-red-500">❤️</span> using Gemini 3 & React
        </p>
      </footer>
    </div>
  );
};

// Simple Zap icon helper
const Zap = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 14l8-10v7h8l-8 10v-7H4z"/>
  </svg>
);

export default App;
