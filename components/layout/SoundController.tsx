
import React from 'react';
import { motion } from 'framer-motion';
import { FaVolumeMute, FaMusic } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

const SoundController: React.FC = () => {
  const { isMuted, toggleMute, playSfx } = useSound();

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          playSfx(SoundType.UI_CLICK);
          toggleMute();
        }}
        className={`
          flex items-center gap-2 px-3 py-1.5 glass rounded-none border transition-all duration-300
          ${isMuted ? 'border-white/10 text-white/30' : 'border-[#FF0080] text-[#FF0080] glow-pink'}
        `}
      >
        {isMuted ? <FaVolumeMute /> : <FaMusic className="animate-pulse" />}
        <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
          {isMuted ? 'Muted' : 'Music for Lyra'}
        </span>
      </motion.button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-[#1A1F3A] border border-[#FF0080] px-3 py-1 text-[8px] font-orbitron text-white whitespace-nowrap glow-pink uppercase tracking-widest">
          Press 'M' to Toggle
        </div>
      </div>
    </div>
  );
};

export default SoundController;
