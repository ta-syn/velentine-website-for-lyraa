import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaPlus, FaTrash } from 'react-icons/fa';
import NeonCard from '../ui/NeonCard';
import GlowText from '../ui/GlowText';
import CyberButton from '../ui/CyberButton';
import Modal from '../ui/Modal';
import AnimatedInput from '../ui/AnimatedInput';
import PasswordModal from '../ui/PasswordModal';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

const INITIAL_REASONS = [
  "Your smile makes every pixel of this world brighter.",
  "The way you look at me when you think I'm not looking.",
  "Your laugh is my favorite soundtrack.",
  "How you always know exactly what to say to calm my digital storms.",
  "Your unwavering kindness to every soul you meet.",
  "The way you nerd out about the things you love.",
  "How you make me want to be the best version of myself.",
  "Your beautiful eyes that hold entire universes.",
  "The way you hold my hand like you're never letting go.",
];

const ReasonsList: React.FC = () => {
  const { playSfx } = useSound();
  const [reasons, setReasons] = useState<string[]>(INITIAL_REASONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReason, setNewReason] = useState('');
  
  // Delete handling
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  // Changed key to force reset to 10 reasons
  const STORAGE_KEY = 'lyra_reasons_v2';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setReasons(JSON.parse(saved));
    }
  }, []);

  const handleAddReason = () => {
    if (!newReason.trim()) return;
    
    const updatedReasons = [newReason, ...reasons];
    setReasons(updatedReasons);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReasons));
    
    setNewReason('');
    setIsModalOpen(false);
    playSfx(SoundType.SUCCESS);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    
    const updatedReasons = reasons.filter((_, i) => i !== deleteIndex);
    setReasons(updatedReasons);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReasons));
    
    setDeleteIndex(null);
    playSfx(SoundType.SUCCESS);
  };

  return (
    <div className="py-20 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <GlowText intensity="high" lyraMode className="text-4xl md:text-6xl font-black uppercase mb-4">
          Infinite Reasons
        </GlowText>
        <p className="font-orbitron text-[#00F0FF] tracking-widest text-sm uppercase">
          Signal count: {reasons.length} (and counting forever)
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {reasons.map((reason, i) => (
            <motion.div
              key={`${i}-${reason.substring(0, 10)}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid relative group"
            >
              <NeonCard 
                glowColor={i % 3 === 0 ? 'pink' : i % 3 === 1 ? 'cyan' : 'purple'}
                hoverable
                className="p-8"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteIndex(i);
                      playSfx(SoundType.UI_CLICK);
                    }}
                    className="text-white/20 hover:text-[#FF0080] transition-colors p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div whileHover={{ scale: 1.2 }}>
                    <FaHeart className={`${i % 2 === 0 ? 'text-[#FF0080]' : 'text-[#B026FF]'} opacity-50`} />
                  </motion.div>
                  <p className="font-rajdhani text-xl text-white italic leading-relaxed">
                    "{reason}"
                  </p>
                  <div className="w-full h-[1px] bg-white/5 mt-2" />
                  <span className="font-orbitron text-[8px] text-gray-600 tracking-widest uppercase">REASON_LOG_{reasons.length - i}</span>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex justify-center">
        <CyberButton variant="yukiToLyraa" icon={<FaPlus />} onClick={() => setIsModalOpen(true)}>
          Add New Reason
        </CyberButton>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
        <h2 className="font-orbitron text-2xl font-bold text-[#FF0080] mb-6 text-center uppercase">Add Reason</h2>
        <div className="space-y-6">
          <AnimatedInput
            label="Why do you love her?"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Type your reason here..."
            autoFocus
          />
          <div className="flex justify-end gap-4 pt-4">
            <CyberButton variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="pink" size="sm" onClick={handleAddReason}>
              Save Reason
            </CyberButton>
          </div>
        </div>
      </Modal>

      <PasswordModal 
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onSuccess={confirmDelete}
        title="Delete Reason"
        actionLabel="Delete Forever"
      />
    </div>
  );
};

export default ReasonsList;
