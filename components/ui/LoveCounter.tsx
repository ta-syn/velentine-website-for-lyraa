
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface LoveCounterProps {
  startDate?: Date; // e.g. new Date('2023-08-14')
}

const LoveCounter: React.FC<LoveCounterProps> = ({ 
  startDate = new Date('2023-08-14') 
}) => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const diff = Math.abs(new Date().getTime() - startDate.getTime());
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    };
    calculate();
    const interval = setInterval(calculate, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [startDate]);

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
          {days}
        </span>
        <span className="font-orbitron text-xs text-[#00F0FF] uppercase tracking-[0.4em]">
          Days of Love
        </span>
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
