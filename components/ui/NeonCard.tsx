
import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';
import { FaHeart } from 'react-icons/fa';

interface NeonCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  glowColor?: 'pink' | 'cyan' | 'purple';
  forLyraa?: boolean;
  className?: string;
  onClick?: () => void;
}

const glowClasses = {
  pink: 'border-[#FF0080]/30 hover:border-[#FF0080]/80 shadow-[0_0_15px_rgba(255,0,128,0.1)] hover:shadow-[0_0_30px_rgba(255,0,128,0.3)]',
  cyan: 'border-[#00F0FF]/30 hover:border-[#00F0FF]/80 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
  purple: 'border-[#B026FF]/30 hover:border-[#B026FF]/80 shadow-[0_0_15px_rgba(176,38,255,0.1)] hover:shadow-[0_0_30px_rgba(176,38,255,0.3)]',
};

const NeonCard: React.FC<NeonCardProps> = ({
  children,
  hoverable = true,
  glowColor = 'cyan',
  forLyraa = false,
  className = '',
  onClick
}) => {
  const { playSfx } = useSound();

  return (
    <motion.div
      whileHover={hoverable ? { y: -5, transition: { duration: 0.3 } } : {}}
      onHoverStart={() => hoverable && playSfx(SoundType.CHIME)}
      onClick={() => {
        if (onClick) {
          playSfx(SoundType.UI_CLICK);
          onClick();
        }
      }}
      className={`
        relative overflow-hidden glass rounded-none border transition-all duration-500
        ${forLyraa ? glowClasses.pink : glowClasses[glowColor]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {forLyraa && (
        <>
          <div className="absolute -bottom-6 -right-6 text-[#FF0080]/10 font-orbitron text-8xl font-black select-none pointer-events-none">
            L
          </div>
          <div className="absolute top-4 right-4 text-[#FF0080]/40">
            <FaHeart className="animate-pulse" />
          </div>
        </>
      )}

      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent animate-scan" />
      </div>

      <div className="p-6 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default NeonCard;
