'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate random hearts
    const newHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 7,
      size: 12 + Math.random() * 16,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-crush-pink"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          initial={{ y: '100vh', rotate: 0 }}
          animate={{
            y: '-100vh',
            rotate: 360,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {['❤️', '💕', '💖', '💗', '💓', '💘'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}

      {/* Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-yellow-300"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            fontSize: '16px',
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
