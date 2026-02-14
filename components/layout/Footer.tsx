
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import GlowText from '../ui/GlowText';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 glass border-t border-[#FF0080]/20 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent animate-pulse" />

      <div className="flex items-center gap-4">
        <div className="w-12 h-[1px] bg-[#00F0FF]/30" />
        <FaHeart className="text-[#FF0080] text-xl animate-heartbeat" />
        <div className="w-12 h-[1px] bg-[#00F0FF]/30" />
      </div>

      <div className="space-y-2">
        <GlowText intensity="high" className="text-2xl font-black tracking-tighter">
          FOREVER YOURS, <span className="text-[#FF0080]">YUKI</span>
        </GlowText>
        <p className="font-rajdhani text-gray-400 text-lg italic">
          "In every universe, I choose you."
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 opacity-50">
        <span className="font-orbitron text-[10px] tracking-widest text-gray-500">
          CREATED WITH LOVE ON FEBRUARY 14, 2024
        </span>
        <span className="font-orbitron text-[8px] tracking-widest text-gray-600">
          STRICTLY FOR LYRA'S EYES ONLY &copy; {currentYear}
        </span>
      </div>

      {/* Decorative background pulse */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FF0080] rounded-full blur-[120px] opacity-10" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00F0FF] rounded-full blur-[120px] opacity-10" />
    </footer>
  );
};

export default Footer;
