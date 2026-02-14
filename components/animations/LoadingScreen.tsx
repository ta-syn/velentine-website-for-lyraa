
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="fixed inset-0 z-[200] bg-[#0A0E27] flex flex-col items-center justify-center p-6"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#FF0080]"
        >
          <FaHeart size={120} className="glow-pink" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-orbitron text-xs font-black animate-pulse">L+Y</span>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="font-orbitron text-xl font-bold text-white mb-2 tracking-[0.2em] uppercase">
          Initializing Love Protocol
        </h2>
        <p className="font-rajdhani text-[#00F0FF] text-lg italic">
          Preparing something special for Lyraa... ❤️
        </p>
      </motion.div>

      <div className="mt-8 w-64 h-1 bg-white/10 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute h-full bg-gradient-to-r from-[#FF0080] via-[#B026FF] to-[#00F0FF] glow-purple"
        />
      </div>
      
      <p className="mt-4 font-orbitron text-[8px] text-gray-500 tracking-widest uppercase">
        Yuki's Heart Data Transfer: 99.9% complete
      </p>
    </motion.div>
  );
};

export default LoadingScreen;
