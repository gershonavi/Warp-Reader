
export interface WordData {
  original: string;
  clean: string;
  orpIndex: number;
}

export interface ReadingStats {
  wpm: number;
  totalWords: number;
  currentIndex: number;
  progress: number;
  estimatedTimeRemaining: number;
}

export enum ReaderState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR'
}
