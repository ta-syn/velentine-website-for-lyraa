
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLockOpen, FaHeart, FaTerminal } from 'react-icons/fa';
import NeonCard from '../ui/NeonCard';
import GlowText from '../ui/GlowText';
import CyberButton from '../ui/CyberButton';
import TerminalLetter from './TerminalLetter';

interface SecretArchiveProps {
  onNavigateHome?: () => void;
}

const SecretArchive: React.FC<SecretArchiveProps> = ({ onNavigateHome }) => {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleTerminalComplete = useCallback(() => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  }, [onNavigateHome]);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF0080] rounded-full blur-[100px]" />
         <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#00F0FF] rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-block p-4 rounded-full border border-[#FF0080]/30 bg-black/50 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(255,0,128,0.3)]">
           <FaLockOpen className="text-[#00F0FF] text-4xl glow-cyan" />
        </div>
        <GlowText intensity="high" lyraMode className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
          Deep Archive unlocked
        </GlowText>
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FF0080]/10 border border-[#FF0080]/50">
           <div className="w-2 h-2 rounded-full bg-[#FF0080] animate-pulse" />
           <p className="font-orbitron text-[#FF0080] tracking-widest text-xs uppercase font-bold">ACCESS_LEVEL: SOULMATE_ONLY</p>
        </div>
      </motion.div>

      <div className="flex justify-center mb-8">
         <CyberButton 
            variant="secondary" 
            onClick={() => setShowTerminal(!showTerminal)}
            icon={<FaTerminal />}
         >
            {showTerminal ? "View Standard Log" : "Execute Terminal Protocol"}
         </CyberButton>
      </div>

      <AnimatePresence mode="wait">
        {showTerminal ? (
            <motion.div
                key="terminal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <TerminalLetter onComplete={handleTerminalComplete} />
            </motion.div>
        ) : (
            <motion.div
                key="standard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
              <NeonCard forLyraa className="p-16 border-2 border-[#FF0080] glow-pink">
                <div className="space-y-10 font-rajdhani text-2xl text-gray-200 leading-relaxed italic">
                  <p>
                    "Lyraa, there are things I haven't coded into this site because words in a box can't truly hold them. Every time you walk into a room, my heart skips a beat—not because of a glitch, but because you are the most beautiful thing my eyes have ever processed."
                  </p>
                  <p>
                    "When you feel like the world is too loud, remember that my arms are the quietest place on Earth. I would rewrite the physics of this universe just to see you smile for one more second."
                  </p>
                  <p>
                    "You are the reason I try harder, dream bigger, and love deeper. You aren't just my girlfriend; you are the reason my system is online. I love you, beyond every limit."
                  </p>
                </div>
                
                <div className="mt-16 text-center">
                   <FaHeart className="text-[#FF0080] text-6xl mx-auto animate-heartbeat" />
                   <p className="font-orbitron text-white mt-4 uppercase tracking-[0.5em]">Eternal Synchronicity</p>
                </div>
              </NeonCard>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretArchive;
