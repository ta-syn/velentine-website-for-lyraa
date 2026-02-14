
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface SectionDividerProps {
  text?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ text = "YUKI ❤️ LYRA" }) => {
  return (
    <div className="relative w-full py-12 flex items-center justify-center">
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent opacity-30" />
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="z-10 bg-[#0A0E27] px-6 flex items-center gap-4"
      >
        <div className="w-12 h-[1px] bg-[#00F0FF] glow-cyan" />
        <div className="flex items-center gap-2">
          <FaHeart className="text-[#FF0080] text-sm animate-pulse" />
          <span className="font-orbitron text-[10px] tracking-[0.4em] text-white/70 uppercase">
            {text}
          </span>
          <FaHeart className="text-[#FF0080] text-sm animate-pulse" />
        </div>
        <div className="w-12 h-[1px] bg-[#00F0FF] glow-cyan" />
      </motion.div>
      
      {/* Animated Scan Line */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent z-0 opacity-50"
      />
    </div>
  );
};

export default SectionDivider;
