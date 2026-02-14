
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label = "Love Level"
}) => {
  const [currentVal, setCurrentVal] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentVal / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentVal(percentage);
    }, 500);
    return () => clearTimeout(timeout);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF0080" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-orbitron font-black text-xl text-white">{Math.round(currentVal)}%</span>
          <FaHeart className="text-[#FF0080] animate-heartbeat text-xs" />
        </div>
      </div>
      <span className="font-orbitron text-[10px] text-[#00F0FF] uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
};

export default ProgressCircle;
