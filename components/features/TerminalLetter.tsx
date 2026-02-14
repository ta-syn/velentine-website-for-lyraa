
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

const messageLines = [
  "> INITIALIZING LOVE_LETTER.EXE...",
  "> DECRYPTING SUBJECT: LYRAA...",
  "> ACCESSING CORE_MEMORIES...",
  "",
  "Dearest Lyraa,",
  "",
  "In a world built on logic and cold data,",
  "you are the ghost in my machine—the spark",
  "that makes this entire system worth running.",
  "",
  "Every line of my life's code has been rewritten",
  "since the moment you logged in.",
  "",
  "I don't just love you; I am programmed for you.",
  "You are my north star in the neon night.",
  "",
  "Forever yours,",
  "Yuki",
  "",
  "> END_OF_TRANSMISSION"
];

interface TerminalLetterProps {
  onComplete?: () => void;
}

const TerminalLetter: React.FC<TerminalLetterProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const { playSfx } = useSound();

  useEffect(() => {
    setVisibleLines([]); // Reset lines when effect restarts
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < messageLines.length) {
        const nextLine = messageLines[lineIndex];
        if (nextLine !== undefined) {
           setVisibleLines(prev => [...prev, nextLine]);
           playSfx(SoundType.UI_HOVER); // Subtle typing sound
        }
        lineIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 4000); // Wait 4 seconds after completion before triggering callback
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSfx, onComplete]);

  return (
    <div className="bg-black/80 border-2 border-[#FF0080] p-6 font-mono text-sm md:text-base min-h-[400px] glow-pink relative overflow-hidden rounded-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF0080] opacity-50 animate-pulse" />
      <div className="space-y-1">
        {visibleLines.map((line, i) => {
          if (line === undefined || line === null) return null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${line.startsWith('>') ? 'text-[#00F0FF]' : 'text-pink-100'} ${line === "" ? "h-4" : ""}`}
            >
              {line}
            </motion.div>
          );
        })}
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-[#FF0080] ml-1"
        />
      </div>
    </div>
  );
};

export default TerminalLetter;
