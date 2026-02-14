import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface LoveCounterProps {
  startDate?: Date;
}

const LoveCounter: React.FC<LoveCounterProps> = ({ 
  startDate
}) => {
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  const time = useMemo(() => {
    if (!anchor) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const now = Date.now();
    const diff = Math.max(0, now - anchor.getTime());
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const minMs = 60 * 1000;
    const days = Math.floor(diff / dayMs);
    const remAfterDays = diff % dayMs;
    const hours = Math.floor(remAfterDays / hourMs);
    const remAfterHours = remAfterDays % hourMs;
    const minutes = Math.floor(remAfterHours / minMs);
    const seconds = Math.floor((remAfterHours % minMs) / 1000);
    return { days, hours, minutes, seconds };
  }, [anchor, tick]);

  useEffect(() => {
    const KEY = 'love_start_date';
    if (startDate) {
      setAnchor(startDate);
      return;
    }
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const d = new Date(saved);
        if (!isNaN(d.getTime())) {
          setAnchor(d);
          return;
        }
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(today.getTime() - 53 * 24 * 60 * 60 * 1000);
      localStorage.setItem(KEY, d.toISOString());
      setAnchor(d);
    } catch {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const fallback = new Date(today.getTime() - 53 * 24 * 60 * 60 * 1000);
      setAnchor(fallback);
    }
  }, [startDate]);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center glass p-8 border-2 border-[#B026FF] glow-purple relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF0080] to-transparent" />
      
      <div className="mb-4">
        <FaHeart className="text-[#FF0080] text-4xl animate-heartbeat group-hover:scale-125 transition-transform" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="font-orbitron text-6xl font-black text-white glow-pink block mb-2">
          {time.days}
        </span>
        <span className="font-orbitron text-xs text-[#00F0FF] uppercase tracking-[0.4em]">
          Days of Love
        </span>
        <div className="mt-3 font-orbitron text-sm text-white/80 tracking-widest">
          {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
        </div>
        <p className="mt-4 font-rajdhani text-gray-400 text-sm max-w-[200px]">
          Since Yuki & Lyraa first synchronized.
        </p>
      </motion.div>

      {/* Floating small hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute text-[#FF0080]"
            style={{ 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%' 
            }}
          >
            <FaHeart size={8} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoveCounter;
