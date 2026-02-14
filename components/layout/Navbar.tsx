
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';
import SoundController from './SoundController';

interface NavbarProps {
  onNavigate: (sector: string) => void;
  currentSector: string;
  onLogoClick?: () => void;
  extraContent?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentSector, onLogoClick, extraContent }) => {
  const { playSfx } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', sector: 'DASHBOARD' },
    { name: 'Our Story', sector: 'STORY' },
    { name: 'Letters', sector: 'LETTERS' },
    { name: 'Reasons', sector: 'REASONS' },
    { name: 'Future', sector: 'FUTURE' },
    { name: 'Game', sector: 'GAME' },
  ];

  const handleLinkClick = (sector: string) => {
    onNavigate(sector);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center glass border-b border-[#00F0FF]/20 backdrop-blur-md">
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => {
          onLogoClick?.();
          handleLinkClick('DASHBOARD');
        }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-[#FF0080] flex items-center justify-center glow-pink bg-black/40 group-active:scale-95 transition-transform">
          <FaHeart className="text-[#FF0080] animate-heartbeat text-sm" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-orbitron font-bold text-lg text-white tracking-widest uppercase">YUKI <span className="text-[#FF0080]">❤️</span> LYRAA</span>
          <span className="font-orbitron text-[8px] text-[#00F0FF] uppercase tracking-tighter opacity-70">VALENTINE_PROTOCOL_V2.1</span>
        </div>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        {extraContent && <div className="mr-4">{extraContent}</div>}
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleLinkClick(link.sector)}
            onMouseEnter={() => playSfx(SoundType.UI_HOVER)}
            className={`font-orbitron text-xs font-bold transition-all relative group py-2 tracking-widest uppercase
              ${currentSector === link.sector ? 'text-[#FF0080]' : 'text-white/70 hover:text-white'}`}
          >
            {link.name}
            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#FF0080] transition-all duration-300 glow-pink
              ${currentSector === link.sector ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>
        ))}
        <div className="h-4 w-[1px] bg-white/20 ml-4 mr-2" />
        <SoundController />
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center gap-4">
        <SoundController />
        <button 
          onClick={() => {
            playSfx(SoundType.UI_CLICK);
            setIsOpen(!isOpen);
          }}
          className="text-white hover:text-[#00F0FF] transition-colors"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-[73px] z-40 bg-[#0A0E27]/98 backdrop-blur-xl p-12 lg:hidden flex flex-col items-center justify-center gap-8"
          >
            {extraContent && <div className="mb-4">{extraContent}</div>}
            {navLinks.map((link, i) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleLinkClick(link.sector)}
                className={`font-orbitron text-3xl font-black uppercase tracking-widest
                  ${currentSector === link.sector ? 'text-[#FF0080] glow-pink' : 'text-white'}`}
              >
                {link.name}
              </motion.button>
            ))}
            <div className="mt-12 opacity-30 text-center">
              <FaHeart className="text-[#FF0080] mx-auto mb-2 animate-pulse" />
              <span className="font-orbitron text-[8px] tracking-[0.3em] uppercase">Private Encryption Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
