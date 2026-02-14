
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';
import { FaHeart } from 'react-icons/fa';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'yukiToLyraa' | 'pink' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-gradient-to-r from-[#FF0080] to-[#B026FF] text-white border-none glow-pink shadow-[0_0_15px_rgba(255,0,128,0.5)]',
  secondary: 'bg-transparent border-2 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 glow-cyan',
  ghost: 'bg-transparent border-none text-white hover:text-[#FF0080] transition-colors',
  yukiToLyraa: 'bg-gradient-to-br from-[#FF0080] via-[#B026FF] to-[#00F0FF] text-white border-none glow-purple uppercase tracking-[0.2em]',
  pink: 'border-[#FF0080] text-[#FF0080] hover:bg-[#FF0080] hover:text-white glow-pink',
  cyan: 'border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-white glow-cyan',
  purple: 'border-[#B026FF] text-[#B026FF] hover:bg-[#B026FF] hover:text-white glow-purple',
};

const sizes = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-8 py-2.5 text-sm',
  lg: 'px-12 py-4 text-lg',
};

const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
}) => {
  const { playSfx } = useSound();

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05, filter: 'brightness(1.1)' } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      onHoverStart={() => !disabled && !loading && playSfx(SoundType.UI_HOVER)}
      onClick={() => {
        if (!disabled && !loading) {
          playSfx(SoundType.UI_CLICK);
          onClick?.();
        }
      }}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center font-orbitron font-bold uppercase transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <FaHeart className="animate-heartbeat text-white" />
            <span className="animate-pulse">Loading...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {icon && <span>{icon}</span>}
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle scanline overlay on hover */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-10 transition-opacity" />
    </motion.button>
  );
};

export default CyberButton;
