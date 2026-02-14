import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGlobe, FaHome, FaInfinity, FaMountain, 
  FaCheckCircle, FaRegCircle, FaPlus, FaCalendarCheck, FaClock, FaTrash,
  FaLaptopCode, FaHeart, FaPlane, FaFilter
} from 'react-icons/fa';
import NeonCard from '../ui/NeonCard';
import GlowText from '../ui/GlowText';
import CyberButton from '../ui/CyberButton';
import PasswordModal from '../ui/PasswordModal';
import { useSound } from '../../contexts/SoundContext';
import { SoundType } from '../../types';

type Category = 'travel' | 'tech' | 'life' | 'adventure';
type CategoryFilter = Category | 'all';

interface BucketItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  category: Category;
}

const initialBucket: BucketItem[] = [
  { id: '1', text: 'Visit Japan together during cherry blossom season', completed: false, createdAt: '2026-02-14T03:00:00Z', category: 'travel' },
  { id: '2', text: 'Build our own custom keyboard together', completed: false, createdAt: '2026-02-14T03:02:00Z', category: 'tech' },
  { id: '3', text: 'Have a 24-hour movie marathon', completed: false, createdAt: '2026-02-14T03:05:00Z', category: 'life' },
  { id: '4', text: 'Cook a 5-course meal from scratch', completed: false, createdAt: '2026-02-14T03:00:00Z', category: 'life' },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'travel', label: 'Travel', icon: <FaPlane />, color: 'text-cyan-400' },
  { id: 'tech', label: 'Tech', icon: <FaLaptopCode />, color: 'text-purple-400' },
  { id: 'life', label: 'Life', icon: <FaHeart />, color: 'text-pink-400' },
  { id: 'adventure', label: 'Adventure', icon: <FaMountain />, color: 'text-green-400' },
];

const FutureVision: React.FC = () => {
  const { playSfx } = useSound();
  const [bucket, setBucket] = useState<BucketItem[]>(initialBucket);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedSections, setExpandedSections] = useState<Record<Category, boolean>>({
    travel: true,
    tech: true,
    life: true,
    adventure: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('lyra_bucket_v3'); // Updated version key
    if (saved) {
      setBucket(JSON.parse(saved));
    } else {
      // Migrate v2 to v3 if needed, or just start fresh/default
      const oldSaved = localStorage.getItem('lyra_bucket_v2');
      if (oldSaved) {
        const oldBucket = JSON.parse(oldSaved);
        const migrated = oldBucket.map((item: any) => ({
          ...item,
          category: item.category || 'life'
        }));
        setBucket(migrated);
        localStorage.setItem('lyra_bucket_v3', JSON.stringify(migrated));
      }
    }
  }, []);

  const saveToStorage = (updated: BucketItem[]) => {
    setBucket(updated);
    localStorage.setItem('lyra_bucket_v3', JSON.stringify(updated));
  };

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTask.trim()) return;

    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      category: selectedCategory === 'all' ? 'life' : selectedCategory, // Default to 'life' if 'all' is selected
    };

    const updated = [newItem, ...bucket];
    saveToStorage(updated);
    setNewTask('');
    playSfx(SoundType.SUCCESS);
  };

  const toggleItem = (id: string) => {
    const updated = bucket.map(item => {
      if (item.id === id) {
        const isCompleting = !item.completed;
        if (isCompleting) playSfx(SoundType.SUCCESS);
        else playSfx(SoundType.UI_CLICK);

        return { 
          ...item, 
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined
        };
      }
      return item;
    });
    saveToStorage(updated);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const updated = bucket.filter(item => item.id !== deleteId);
    saveToStorage(updated);
    setDeleteId(null);
    playSfx(SoundType.SUCCESS);
  };

  const formatCyberDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).toUpperCase();
  };

  const getCategoryIcon = (cat: Category) => {
    return CATEGORIES.find(c => c.id === cat)?.icon || <FaGlobe />;
  };

  const getCategoryColor = (cat: Category) => {
    return CATEGORIES.find(c => c.id === cat)?.color || 'text-white';
  };

  const filteredBucket = bucket.filter(item => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  // Filter by selected category if not 'all'
  const categoryFilteredBucket = selectedCategory === 'all' 
    ? filteredBucket 
    : filteredBucket.filter(item => item.category === selectedCategory);

  const completionPercentage = categoryFilteredBucket.length > 0
    ? Math.round((categoryFilteredBucket.filter(b => b.completed).length / categoryFilteredBucket.length) * 100) 
    : 0;

  const toggleSection = (category: Category) => {
    // When clicking a section, show only that section and hide all others
    const newExpandedSections: Record<Category, boolean> = {
      travel: category === 'travel',
      tech: category === 'tech', 
      life: category === 'life',
      adventure: category === 'adventure'
    };
    
    setExpandedSections(newExpandedSections);
    setSelectedCategory(category); // Also filter to show only this category
    playSfx(SoundType.UI_CLICK);
  };

  // Group items by category
  const groupedItems = CATEGORIES.map(category => ({
    ...category,
    items: filteredBucket.filter(item => item.category === category.id),
    expanded: expandedSections[category.id]
  }));

  return (
    <div className="py-16 max-w-6xl mx-auto px-6 space-y-16">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlowText intensity="high" lyraMode className="text-6xl md:text-8xl font-black uppercase mb-8 italic tracking-tighter bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#B026FF] bg-clip-text text-transparent">
          OUR FUTURE
        </GlowText>
        <motion.p 
          className="font-rajdhani text-2xl text-gray-300 max-w-3xl mx-auto italic leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          "I don't just want to predict the future. I want to architect it with you, one line of code at a time."
        </motion.p>
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-[#00F0FF] to-[#FF0080] rounded-full"></div>
        </div>
      </motion.div>

      {/* BUCKET LIST */}
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <NeonCard glowColor="cyan" className="p-10 md:p-14 backdrop-blur-sm bg-[#0A0E27]/80 border-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#00F0FF]/30 pb-8 gap-6">
            <motion.div 
              className="flex items-center gap-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <FaInfinity className="text-[#00F0FF] text-4xl glow-cyan" />
                <div className="absolute inset-0 bg-[#00F0FF] rounded-full opacity-20 blur-md"></div>
              </div>
              <div>
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter bg-gradient-to-r from-[#00F0FF] to-[#FF0080] bg-clip-text text-transparent">
                  SHARED OBJECTIVES
                </h2>
                <div className="flex items-center gap-3 mt-2">
                   <div className="h-2 w-40 bg-gray-900 rounded-full overflow-hidden border border-[#00F0FF]/30">
                     <motion.div 
                       className="h-full bg-gradient-to-r from-[#00F0FF] via-[#FF0080] to-[#B026FF] transition-all duration-1500"
                       initial={{ width: 0 }}
                       animate={{ width: `${completionPercentage}%` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                   </div>
                   <span className="font-orbitron text-sm text-[#00F0FF] glow-cyan">{completionPercentage}% SYNCED</span>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-[10px] font-orbitron uppercase border transition-all flex items-center gap-1 ${
                    filter === f 
                      ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]' 
                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                  }`}
                >
                  {f === 'all' && <FaGlobe className="text-xs" />}
                  {f === 'active' && <FaHome className="text-xs" />}
                  {f === 'completed' && <FaFilter className="text-xs" />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddTask} className="mb-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new dream..."
                className="flex-1 bg-[#0A0E27]/50 border border-[#00F0FF]/30 rounded px-6 py-4 text-white font-rajdhani outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
              />
              <CyberButton variant="yukiToLyraa" icon={<FaPlus />} onClick={handleAddTask}>
                Add
              </CyberButton>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-orbitron text-sm uppercase text-gray-400 tracking-widest">
                Select Section:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const category = e.target.value as Category;
                  setSelectedCategory(category);
                  toggleSection(category);
                }}
                className="bg-[#0A0E27]/50 border border-[#00F0FF]/30 rounded px-4 py-2 text-white font-rajdhani outline-none focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#0A0E27] text-white">
                    {cat.label}
                  </option>
                ))}
              </select>
              
              <div className="hidden md:flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      toggleSection(cat.id as Category);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? `bg-white/10 border-${cat.color.split('-')[1]}-400 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                        : 'bg-transparent border-white/10 text-gray-500 hover:bg-white/5'
                    }`}
                  >
                    <span className={cat.color}>{cat.icon}</span>
                    <span className="font-orbitron text-xs uppercase">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {groupedItems.map(({ id, label, icon, color, items, expanded }) => (
                <div key={id} className="space-y-2">
                  {/* Section Header with Toggle */}
                  <button
                    onClick={() => toggleSection(id as Category)}
                    className="w-full flex items-center justify-between p-4 rounded border border-white/10 hover:border-[#00F0FF]/50 bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={getCategoryColor(id as Category)}>{getCategoryIcon(id as Category)}</span>
                      <span className="font-orbitron text-sm uppercase tracking-widest text-white">
                        {label} ({items.length})
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-white/60 group-hover:text-[#00F0FF] transition-colors ${expanded ? 'text-[#00F0FF]' : ''}`}
                    >
                      ▼
                    </motion.div>
                  </button>

                  {/* Section Content */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pl-4 border-l-2 border-white/10 ml-3">
                          {items.length > 0 ? (
                            items.map(item => (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group flex items-start gap-4 p-4 rounded border transition-all ${
                                  item.completed 
                                    ? 'bg-green-500/5 border-green-500/30' 
                                    : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/50'
                                }`}
                              >
                                <button 
                                  onClick={() => toggleItem(item.id)}
                                  className={`text-2xl mt-1 transition-colors ${item.completed ? 'text-green-400' : 'text-gray-600 hover:text-[#00F0FF]'}`}
                                >
                                  {item.completed ? <FaCheckCircle /> : <FaRegCircle />}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <p className={`font-rajdhani text-lg break-words ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                    {item.text}
                                  </p>
                                  
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <FaClock className="text-xs" />
                                      Created: {formatCyberDate(item.createdAt)}
                                    </span>
                                    {item.completed && item.completedAt && (
                                      <span className="flex items-center gap-1 text-green-500/70">
                                        <FaCalendarCheck className="text-xs" />
                                        Completed: {formatCyberDate(item.completedAt)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <button 
                                  onClick={() => setDeleteId(item.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-[#FF0080] p-2"
                                  title="Delete Objective"
                                >
                                  <FaTrash />
                                </button>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              className="text-center py-6 text-gray-500 font-orbitron text-xs uppercase tracking-widest italic"
                            >
                              No objectives in this sector
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {categoryFilteredBucket.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-10 text-gray-500 font-orbitron text-sm uppercase tracking-widest"
                >
                  No objectives found in any sector.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NeonCard>
      </motion.div>

      <PasswordModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={confirmDelete}
        title="Delete Objective"
        actionLabel="Delete Forever"
      />
    </div>
  );
};

export default FutureVision;
