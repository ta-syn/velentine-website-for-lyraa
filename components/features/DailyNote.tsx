
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaCalendarDay } from 'react-icons/fa';
import { DAILY_NOTES } from '../../lib/constants';
import NeonCard from '../ui/NeonCard';

const DailyNote: React.FC = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  // Deterministic note based on day of the year
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const noteIndex = dayOfYear % DAILY_NOTES.length;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto py-10"
    >
      <NeonCard glowColor="pink" className="text-center p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <FaCalendarDay size={80} />
        </div>
        <span className="font-orbitron text-[10px] text-[#00F0FF] tracking-[0.4em] uppercase mb-2 block">{dateStr}</span>
        <h3 className="font-orbitron text-xl font-bold text-white mb-8 uppercase italic">Signal of the Day</h3>
        
        <div className="py-8 border-y border-white/10">
           <p className="font-rajdhani text-2xl md:text-3xl text-white italic leading-relaxed">
             "{DAILY_NOTES[noteIndex]}"
           </p>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2">
           <FaHeart className="text-[#FF0080] animate-heartbeat" />
           <span className="font-orbitron text-[10px] text-gray-500 uppercase tracking-widest">Always Thinking Of You // Yuki</span>
        </div>
      </NeonCard>
    </motion.div>
  );
};

export default DailyNote;
