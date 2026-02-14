import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPenNib, FaPlus, FaTrash } from 'react-icons/fa';
import NeonCard from '../ui/NeonCard';
import CyberButton from '../ui/CyberButton';
import Modal from '../ui/Modal';
import AnimatedInput from '../ui/AnimatedInput';
import PasswordModal from '../ui/PasswordModal';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

interface Letter {
  id: string;
  title: string;
  date: string;
  content: string;
  sealed: boolean;
}

const initialLetters: Letter[] = [
  { id: '1', date: '2025-12-25', title: 'Why I Love You', content: 'Dearest Lyraa,\n\nI love you because of the way your mind works, finding beauty in the smallest things. I love you because you make me feel like a hero even when I\'m just being myself. Most of all, I love you because you are my home in this vast, chaotic digital universe.', sealed: false },
  { id: '2', date: '2026-01-01', title: 'My Favorite Memories', content: 'Lyraa,\n\nThinking back to our first conversations in MLBB Global Chat. The way we connected across the distance... that connection is my favorite feeling. Every moment we share is a line of code in the masterpiece of our long-distance love story.', sealed: false },
  { id: '3', date: '2026-02-14', title: 'Our Future', content: 'Happy Valentine\'s Day, my love.\n\nI see us bridging the distance, still holding each other close despite the miles. I promise to be your shield, your comfort, and your constant through every challenge our long-distance journey brings.', sealed: false },
];

const LettersArchive: React.FC = () => {
  const { playSfx } = useSound();
  const [letters, setLetters] = useState<Letter[]>(initialLetters);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newLetter, setNewLetter] = useState({ title: '', content: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lyra_letters');
    if (saved) setLetters(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      setTypewriterText("");
      let i = 0;
      const interval = setInterval(() => {
        if (i < selectedLetter.content.length) {
          setTypewriterText(prev => prev + selectedLetter.content[i]);
          i++;
          if (i % 5 === 0) playSfx(SoundType.UI_HOVER); // Typing sound effect
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [selectedLetter, playSfx]);

  const handleCreateLetter = () => {
    if (!newLetter.title || !newLetter.content) return;
    const created: Letter = {
      id: Date.now().toString(),
      title: newLetter.title,
      date: new Date().toISOString().split('T')[0],
      content: newLetter.content,
      sealed: false
    };
    const updated = [created, ...letters];
    setLetters(updated);
    localStorage.setItem('lyra_letters', JSON.stringify(updated));
    setIsCreating(false);
    setNewLetter({ title: '', content: '' });
    playSfx(SoundType.SUCCESS);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const updated = letters.filter(l => l.id !== deleteId);
    setLetters(updated);
    localStorage.setItem('lyra_letters', JSON.stringify(updated));
    if (selectedLetter?.id === deleteId) setSelectedLetter(null);
    setDeleteId(null);
    playSfx(SoundType.SUCCESS);
  };

  return (
    <div className="py-20 max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {letters.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -10 }}
            >
              <NeonCard
                glowColor="purple"
                className="group cursor-pointer h-full flex flex-col items-center justify-center p-10 text-center relative"
                onClick={() => setSelectedLetter(l)}
              >
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(l.id);
                          playSfx(SoundType.UI_CLICK);
                        }}
                        className="text-white/20 hover:text-[#FF0080] transition-colors p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="mb-6"
                >
                  <FaEnvelope size={50} className="text-[#B026FF] group-hover:text-[#FF0080] transition-colors" />
                </motion.div>
                <span className="font-orbitron text-[10px] text-[#00F0FF] mb-2 block uppercase tracking-widest">{l.date}</span>
                <h3 className="font-orbitron text-xl font-bold text-white uppercase group-hover:text-glow-pink transition-all">
                  {l.title}
                </h3>
                <p className="mt-4 font-rajdhani text-gray-500 text-sm italic">"Click to decrypt message..."</p>
              </NeonCard>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <NeonCard 
              glowColor="cyan"
              className="h-full flex flex-col items-center justify-center p-10 cursor-pointer border-dashed border-2 border-[#00F0FF]/30 hover:border-[#00F0FF]"
              onClick={() => setIsCreating(true)}
            >
              <FaPlus size={40} className="text-[#00F0FF] mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-[#00F0FF] uppercase">Write New Letter</h3>
            </NeonCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <Modal isOpen={!!selectedLetter} onClose={() => setSelectedLetter(null)} size="lg">
        {selectedLetter && (
          <div className="font-rajdhani">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="font-orbitron text-[#00F0FF] text-xs tracking-widest block mb-1">{selectedLetter.date}</span>
                <h2 className="font-orbitron text-3xl font-bold text-white uppercase text-glow-pink">{selectedLetter.title}</h2>
              </div>
              <FaPenNib className="text-[#FF0080] text-2xl" />
            </div>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-200 min-h-[200px] font-mono">
              {typewriterText}
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-[#FF0080]">_</motion.span>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} size="lg">
        <h2 className="font-orbitron text-2xl font-bold text-[#00F0FF] mb-6 text-center uppercase">Compose New Letter</h2>
        <div className="space-y-6">
          <AnimatedInput
            label="Letter Title"
            value={newLetter.title}
            onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
            placeholder="Subject..."
            autoFocus
          />
          <div className="relative">
            <label className="block text-xs font-orbitron text-[#00F0FF] uppercase tracking-widest mb-2 pl-1">Message Content</label>
            <textarea
              value={newLetter.content}
              onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
              className="w-full h-48 bg-[#1A1F3A]/50 border-2 border-white/10 rounded p-4 font-rajdhani text-white outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all resize-none"
              placeholder="Write your heart out..."
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <CyberButton variant="secondary" size="sm" onClick={() => setIsCreating(false)}>
              Discard
            </CyberButton>
            <CyberButton variant="pink" size="sm" onClick={handleCreateLetter}>
              Encrypt & Send
            </CyberButton>
          </div>
        </div>
      </Modal>

      <PasswordModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={confirmDelete}
        title="Burn Letter"
        actionLabel="Delete Forever"
      />
    </div>
  );
};

export default LettersArchive;
