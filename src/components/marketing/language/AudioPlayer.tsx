'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioFile: string;
}

export default function AudioPlayer({ audioFile }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-detect folder from audioFile prefix
  const folder = audioFile.split('_')[0]; // 'hsk1', 'teacher', 'apps', etc.
  const audioPath = `/audio/${folder}/${audioFile}.mp3`;

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="inline-block">
      <audio ref={audioRef} src={audioPath} preload="none" />
      <button
        onClick={handlePlay}
        className={`p-2 rounded-lg transition-all ${
          isPlaying
            ? 'bg-brand-red text-white hover:bg-red-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label={`Play audio for ${audioFile}`}
        title="Play audio"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
