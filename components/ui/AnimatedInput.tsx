import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';
import { FaHeart, FaExclamationCircle } from 'react-icons/fa';

interface AnimatedInputProps {
  label: string;
  type?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
  name?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  type = 'text',
  error,
  success,
  icon = <FaHeart className="text-[#FF0080]/50" />,
  value,
  onChange,
  placeholder,
  autoFocus,
  id,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { playSfx } = useSound();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? label.toLowerCase().replace(/\s+/g, '_');

  const handleFocus = () => {
    setIsFocused(true);
    playSfx(SoundType.UI_HOVER);
  };

  return (
    <div className="relative mb-6">
      <label htmlFor={inputId} className="flex items-center gap-2 mb-1 pl-1">
        <span className="text-xs font-orbitron text-[#00F0FF] uppercase tracking-widest">{label}</span>
      </label>
      
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {icon}
        </div>
        
        <input
          id={inputId}
          name={inputName}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`
            w-full bg-[#1A1F3A]/50 border-2 py-3 pl-10 pr-4 font-rajdhani text-white outline-none transition-all duration-300
            ${isFocused ? 'border-[#00F0FF] glow-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10'}
            ${error ? 'border-[#FF0080]/50 glow-pink' : ''}
            ${success ? 'border-green-400 glow-cyan' : ''}
          `}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -5, opacity: 0 }}
              id={`${inputId}-error`}
              className="absolute -bottom-6 left-0 flex items-center gap-1 text-[#FF0080] text-[10px] font-orbitron"
            >
              <FaExclamationCircle />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
            >
              <FaHeart className="animate-heartbeat" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedInput;
