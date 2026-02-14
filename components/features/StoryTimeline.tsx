import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaPlus, FaCalendarAlt, FaStar, FaTrash } from 'react-icons/fa';
import NeonCard from '../ui/NeonCard';
import CyberButton from '../ui/CyberButton';
import AnimatedInput from '../ui/AnimatedInput';
import Modal from '../ui/Modal';
import PasswordModal from '../ui/PasswordModal';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

interface Milestone {
  id: string;
  date: string;
  title: string;
  story: string;
  icon?: 'heart' | 'star' | 'camera';
}

const initialMilestones: Milestone[] = [
  { id: '1', date: '2025-12-23', title: 'The Day We Connected', story: 'In the MLBB Global Chat, our digital worlds collided. That first message felt like finding a rare signal in the noise - something special was beginning across the distance.', icon: 'star' },
  { id: '2', date: '2025-12-25', title: 'First Deep Conversation', story: 'Christmas Day, but the real gift was our connection. We talked for hours, bridging the physical distance with emotional closeness that felt like we were in the same room.', icon: 'camera' },
  { id: '3', date: '2026-01-01', title: 'New Year, New Connection', story: 'We welcomed the new year together despite the miles between us. Our long-distance bond grew stronger with each shared moment and whispered promise.', icon: 'heart' },
];

const StoryTimeline: React.FC = () => {
  const { playSfx } = useSound();
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ date: '', title: '', story: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lyra_milestones');
    if (saved) setMilestones(JSON.parse(saved));
  }, []);

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.story) return;
    const added = [...milestones, { ...newMilestone, id: Date.now().toString(), icon: 'heart' as const }]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setMilestones(added);
    localStorage.setItem('lyra_milestones', JSON.stringify(added));
    setIsModalOpen(false);
    playSfx(SoundType.SUCCESS);
    setNewMilestone({ date: '', title: '', story: '' });
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const updated = milestones.filter(m => m.id !== deleteId);
    setMilestones(updated);
    localStorage.setItem('lyra_milestones', JSON.stringify(updated));
    setDeleteId(null);
    playSfx(SoundType.SUCCESS);
  };

  return (
    <div className="relative py-20 w-full max-w-4xl mx-auto px-6">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00F0FF] via-[#B026FF] to-[#FF0080] opacity-20 hidden md:block" />

      <div className="flex flex-col gap-16 relative">
        <AnimatePresence>
          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="flex-1 w-full relative group">
                <NeonCard forLyraa={i % 2 === 0} glowColor={i % 2 === 0 ? 'pink' : 'cyan'}>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(m.id);
                          playSfx(SoundType.UI_CLICK);
                        }}
                        className="text-white/20 hover:text-[#FF0080] transition-colors p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  <span className="font-orbitron text-[#00F0FF] text-xs mb-2 block tracking-widest">{m.date}</span>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-4 uppercase">{m.title}</h3>
                  <p className="font-rajdhani text-gray-300 leading-relaxed italic">"{m.story}"</p>
                </NeonCard>
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-12 rounded-full glass border-2 border-[#FF0080] flex items-center justify-center glow-pink bg-black"
                >
                  <FaHeart className="text-[#FF0080] text-lg animate-heartbeat" />
                </motion.div>
              </div>

              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex justify-center">
        <CyberButton variant="yukiToLyraa" icon={<FaPlus />} onClick={() => setIsModalOpen(true)}>
          Add New Memory
        </CyberButton>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="font-orbitron text-2xl font-bold text-[#FF0080] mb-8 text-center uppercase">Log New Memory</h2>
        <div className="space-y-6">
          <AnimatedInput
            label="Date of Signal"
            type="date"
            value={newMilestone.date}
            onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
            placeholder=""
            autoFocus
          />
          <AnimatedInput
            label="Event Title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="What happened?"
          />
          <AnimatedInput
            label="Our Story"
            value={newMilestone.story}
            onChange={(e) => setNewMilestone({ ...newMilestone, story: e.target.value })}
            placeholder="Tell the story..."
          />
          
          <div className="flex justify-end gap-4 pt-4">
            <CyberButton variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </CyberButton>
            <CyberButton variant="pink" size="sm" onClick={handleAddMilestone}>
              Save Memory
            </CyberButton>
          </div>
        </div>
      </Modal>

      <PasswordModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={confirmDelete}
        title="Delete Memory"
        actionLabel="Delete Forever"
      />
    </div>
  );
};

export default StoryTimeline;
