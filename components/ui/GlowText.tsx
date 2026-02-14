
import React from 'react';
import { motion } from 'framer-motion';

interface GlowTextProps {
  children: React.ReactNode;
  intensity?: 'none' | 'low' | 'medium' | 'high';
  gradient?: boolean;
  animated?: 'none' | 'pulse' | 'sparkle';
  lyraMode?: boolean;
  className?: string;
}

const GlowText: React.FC<GlowTextProps> = ({
  children,
  intensity = 'medium',
  gradient = false,
  animated = 'none',
  lyraMode = false,
  className = ''
}) => {
  const glows = {
    none: '',
    low: '0 0 5px currentColor',
    medium: '0 0 10px currentColor, 0 0 20px currentColor',
    high: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
  };

  const animations = {
    none: {},
    pulse: {
      opacity: [1, 0.7, 1],
      filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
      transition: { duration: 2, repeat: Infinity }
    },
    sparkle: {
      textShadow: [
        '0 0 5px rgba(255,0,128,0.5)',
        '0 0 20px rgba(0,240,255,0.8)',
        '0 0 5px rgba(255,0,128,0.5)'
      ],
      transition: { duration: 3, repeat: Infinity }
    }
  };

  return (
    <motion.span
      animate={animations[animated]}
      style={{
        // Fixed: Added 'none' to intensity type and glows map to resolve comparison mismatch
        textShadow: intensity !== 'none' ? glows[intensity] : 'none',
        display: 'inline-block'
      }}
      className={`
        font-orbitron
        ${lyraMode ? 'bg-gradient-to-r from-[#FF0080] via-[#B026FF] to-[#00F0FF] bg-clip-text text-transparent' : ''}
        ${gradient && !lyraMode ? 'bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent' : ''}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

export default GlowText;
