
import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';

interface ControlsProps {
  wpm: number;
  setWpm: (wpm: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  progress: number;
  currentIndex: number;
  totalWords: number;
  onSeek: (index: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  wpm,
  setWpm,
  isPlaying,
  onTogglePlay,
  onReset,
  progress,
  currentIndex,
  totalWords,
  onSeek
}) => {
  return (
    <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Playback Controls */}
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={() => onSeek(Math.max(0, currentIndex - 20))}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Rewind 20 words"
          >
            <Rewind size={24} />
          </button>
          
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          <button
            onClick={() => onSeek(Math.min(totalWords - 1, currentIndex + 20))}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Fast forward 20 words"
          >
            <FastForward size={24} />
          </button>

          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* WPM Control */}
        <div className="flex-1 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Reading Speed</span>
            <span className="text-2xl font-bold text-red-500">{wpm} <span className="text-sm text-slate-500">WPM</span></span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="10"
            value={wpm}
            onChange={(e) => setWpm(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>100 WPM</span>
            <span>600 WPM</span>
            <span>1200 WPM</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{currentIndex} / {totalWords} words</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div 
          className="relative h-2 bg-slate-700 rounded-full cursor-pointer overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = x / rect.width;
            onSeek(Math.floor(totalWords * pct));
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;
