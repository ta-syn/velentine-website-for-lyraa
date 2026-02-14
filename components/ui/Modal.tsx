
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  romantic?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  romantic = false
}) => {
  const { playSfx } = useSound();

  useEffect(() => {
    if (isOpen) {
      playSfx(SoundType.ENTRANCE);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, playSfx]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-4xl',
    full: 'max-w-[95%]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          >
             {romantic && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                   {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: '100%', x: Math.random() * 100 + '%' }}
                        animate={{ y: '-20%' }}
                        transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: "linear" }}
                        className="absolute text-[#FF0080]"
                      >
                         <FaHeart size={Math.random() * 20 + 10} />
                      </motion.div>
                   ))}
                </div>
             )}
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`
              relative w-full glass rounded-none border-2 border-[#FF0080] glow-pink overflow-hidden z-10
              ${sizes[size]}
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] to-[#00F0FF]" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-[#FF0080] transition-colors p-2"
            >
              <FaTimes size={20} />
            </button>

            <div className="p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
