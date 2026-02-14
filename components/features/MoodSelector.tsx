
import React from 'react';
import { motion } from 'framer-motion';
import { FaSmile, FaCloudRain, FaBolt, FaHeart } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

type Mood = 'HAPPY' | 'SAD' | 'STRESSED' | 'MISSING_YOU';

interface MoodSelectorProps {
  onMoodChange: (mood: Mood) => void;
  currentMood: Mood;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodChange, currentMood }) => {
  const { playSfx } = useSound();

  const moods: { type: Mood; icon: any; color: string }[] = [
    { type: 'HAPPY', icon: <FaSmile />, color: '#FF0080' },
    { type: 'SAD', icon: <FaCloudRain />, color: '#00F0FF' },
    { type: 'STRESSED', icon: <FaBolt />, color: '#B026FF' },
    { type: 'MISSING_YOU', icon: <FaHeart />, color: '#ffffff' },
  ];

  return (
    <div className="flex gap-2 p-1 glass border border-white/10 rounded-full">
      {moods.map((m) => (
        <motion.button
          key={m.type}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playSfx(SoundType.UI_CLICK);
            onMoodChange(m.type);
          }}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full transition-all text-xs
            ${currentMood === m.type ? 'bg-white text-black glow-pink' : 'text-white/50 hover:text-white'}
          `}
          style={{ borderColor: m.color }}
          title={m.type.replace('_', ' ')}
        >
          {m.icon}
        </motion.button>
      ))}
    </div>
  );
};

export default MoodSelector;
