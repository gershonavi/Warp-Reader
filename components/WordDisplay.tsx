
import React from 'react';
import { WordData } from '../types';

interface WordDisplayProps {
  word: WordData;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word }) => {
  const { original, orpIndex } = word;
  
  // Splitting the word into three parts: pre-ORP, ORP (red), and post-ORP
  const before = original.substring(0, orpIndex);
  const focus = original.substring(orpIndex, orpIndex + 1);
  const after = original.substring(orpIndex + 1);

  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden bg-slate-900 border-y-2 border-slate-700">
      {/* Alignment Markers */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500/20 pointer-events-none -translate-x-1/2"></div>
      <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 flex flex-col justify-between">
        <div className="w-1 h-2 bg-red-500 rounded-full"></div>
        <div className="w-1 h-2 bg-red-500 rounded-full"></div>
      </div>

      <div className="text-4xl md:text-6xl font-mono font-bold whitespace-nowrap flex items-center">
        {/* We use a fixed-width container for the "before" part to keep the focus letter centered */}
        <div className="flex justify-end min-w-[50%] pr-[0.1em]">
          <span className="text-slate-400">{before}</span>
        </div>
        
        <span className="text-red-500 relative">
          {focus}
        </span>
        
        <div className="flex justify-start min-w-[50%] pl-[0.1em]">
          <span className="text-slate-400">{after}</span>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;
