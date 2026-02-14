
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

interface HeartAnimationProps {
  trigger: boolean;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ trigger }) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newHearts = [...Array(15)].map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: 80 + Math.random() * 20,
        size: Math.random() * 30 + 10,
        color: ['#FF0080', '#00F0FF', '#B026FF'][Math.floor(Math.random() * 3)]
      }));
      setHearts(prev => [...prev, ...newHearts]);
      
      const timer = setTimeout(() => {
        setHearts([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[110]">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: '80%', x: heart.x + '%' }}
            animate={{ opacity: [0, 1, 0], y: '-20%', x: (heart.x + (Math.random() * 20 - 10)) + '%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{ color: heart.color, position: 'absolute' }}
          >
            <FaHeart size={heart.size} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeartAnimation;
