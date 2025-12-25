'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CompatibilityData {
  score: number;
  level: string;
  level_index: number;
  emoji: string;
  message: string;
  color: string;
}

interface CompatibilityMeterProps {
  data: CompatibilityData | null;
  isLoading?: boolean;
}

// Particle component for various effects
const Particle = ({
  emoji,
  delay,
  duration,
  startX,
  startY,
  endX,
  endY,
  size = 20
}: {
  emoji: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size?: number;
}) => (
  <motion.span
    className="absolute pointer-events-none"
    style={{ fontSize: size, left: startX, top: startY }}
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5],
      x: endX - startX,
      y: endY - startY,
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  >
    {emoji}
  </motion.span>
);

// Level 0: Different Worlds - Subtle gray mist
const DifferentWorldsEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-8 h-8 rounded-full bg-gray-300/30"
        style={{
          left: `${20 + i * 15}%`,
          top: `${30 + (i % 2) * 20}%`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          delay: i * 0.5,
          repeat: Infinity,
        }}
      />
    ))}
    <motion.span
      className="absolute text-2xl"
      style={{ left: '45%', top: '20%' }}
      animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🌍
    </motion.span>
  </div>
);

// Level 1: Curious Spark - Blue sparkles
const CuriousSparkEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    {[...Array(8)].map((_, i) => (
      <Particle
        key={i}
        emoji="✨"
        delay={i * 0.3}
        duration={2}
        startX={50 + Math.cos(i * 45 * Math.PI / 180) * 30}
        startY={50}
        endX={50 + Math.cos(i * 45 * Math.PI / 180) * 80}
        endY={50 + Math.sin(i * 45 * Math.PI / 180) * 40}
        size={16}
      />
    ))}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-300/20 to-blue-400/10"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

// Level 2: Growing Connection - Green glow with leaves
const GrowingConnectionEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    {/* Growing vine */}
    <motion.div
      className="absolute bottom-0 left-1/2 w-1 bg-gradient-to-t from-green-500 to-green-300"
      initial={{ height: 0 }}
      animate={{ height: '60%' }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
    />
    {/* Leaves */}
    {['🌱', '🍀', '🌿', '💚'].map((emoji, i) => (
      <motion.span
        key={i}
        className="absolute text-xl"
        style={{ left: `${20 + i * 20}%`, bottom: '10%' }}
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{
          opacity: 1,
          scale: [0, 1, 1.1, 1],
          y: [20, 0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          delay: i * 0.3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        {emoji}
      </motion.span>
    ))}
    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-green-400/20 to-transparent"
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </div>
);

// Level 3: Strong Chemistry - Purple hearts and bubbles
const StrongChemistryEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    {/* Floating hearts */}
    {[...Array(6)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl"
        style={{
          left: `${10 + i * 15}%`,
          bottom: '-20px'
        }}
        animate={{
          y: [0, -120],
          x: [0, Math.sin(i) * 20],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
          rotate: [0, i % 2 === 0 ? 20 : -20],
        }}
        transition={{
          duration: 3,
          delay: i * 0.4,
          repeat: Infinity,
        }}
      >
        {i % 2 === 0 ? '💜' : '💗'}
      </motion.span>
    ))}
    {/* Bubbles */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={`bubble-${i}`}
        className="absolute w-4 h-4 rounded-full border-2 border-purple-400/50"
        style={{
          left: `${15 + i * 25}%`,
          bottom: '10%'
        }}
        animate={{
          y: [0, -80],
          opacity: [0.5, 0],
          scale: [0.5, 1.5],
        }}
        transition={{
          duration: 2,
          delay: i * 0.5,
          repeat: Infinity,
        }}
      />
    ))}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-purple-400/20"
      animate={{
        background: [
          'linear-gradient(to bottom right, rgba(192,132,252,0.2), rgba(249,168,212,0.2), rgba(192,132,252,0.2))',
          'linear-gradient(to bottom right, rgba(249,168,212,0.2), rgba(192,132,252,0.2), rgba(249,168,212,0.2))',
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
    />
  </div>
);

// Level 4: Soulmates - Rainbow fireworks explosion
const SoulmatesEffect = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    {/* Rainbow gradient */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          'linear-gradient(45deg, rgba(255,0,0,0.15), rgba(255,127,0,0.15), rgba(255,255,0,0.15), rgba(0,255,0,0.15), rgba(0,0,255,0.15), rgba(139,0,255,0.15))',
          'linear-gradient(90deg, rgba(139,0,255,0.15), rgba(255,0,0,0.15), rgba(255,127,0,0.15), rgba(255,255,0,0.15), rgba(0,255,0,0.15), rgba(0,0,255,0.15))',
          'linear-gradient(135deg, rgba(0,0,255,0.15), rgba(139,0,255,0.15), rgba(255,0,0,0.15), rgba(255,127,0,0.15), rgba(255,255,0,0.15), rgba(0,255,0,0.15))',
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Fireworks */}
    {[...Array(8)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-2xl"
        style={{
          left: '50%',
          top: '50%',
        }}
        animate={{
          x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
          y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
          opacity: [1, 0],
          scale: [0, 1.5],
        }}
        transition={{
          duration: 1.5,
          delay: i * 0.1,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        {['💕', '✨', '💖', '⭐', '💗', '🌟', '💓', '❤️'][i]}
      </motion.span>
    ))}

    {/* Confetti */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`confetti-${i}`}
        className="absolute w-2 h-2 rounded-sm"
        style={{
          left: `${50 + (Math.random() - 0.5) * 20}%`,
          top: '0%',
          backgroundColor: ['#FF6B9D', '#C9A7FF', '#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][i % 6]
        }}
        animate={{
          y: [0, 100],
          x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
          rotate: [0, 360],
          opacity: [1, 0],
        }}
        transition={{
          duration: 2,
          delay: i * 0.15,
          repeat: Infinity,
        }}
      />
    ))}

    {/* Pulsing glow */}
    <motion.div
      className="absolute inset-0 rounded-xl"
      style={{ boxShadow: '0 0 30px rgba(244, 114, 182, 0.5)' }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(244, 114, 182, 0.3)',
          '0 0 40px rgba(244, 114, 182, 0.6)',
          '0 0 20px rgba(244, 114, 182, 0.3)',
        ]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </div>
);

const EffectComponents = [
  DifferentWorldsEffect,
  CuriousSparkEffect,
  GrowingConnectionEffect,
  StrongChemistryEffect,
  SoulmatesEffect,
];

export default function CompatibilityMeter({ data, isLoading }: CompatibilityMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score counting up
  useEffect(() => {
    if (data?.score !== undefined) {
      const duration = 1500;
      const steps = 60;
      const increment = data.score / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= data.score) {
          setDisplayScore(data.score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [data?.score]);

  if (isLoading) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur rounded-xl p-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3">
          <motion.span
            className="text-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            💫
          </motion.span>
          <span className="text-gray-600">Calculating compatibility...</span>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  const EffectComponent = EffectComponents[data.level_index];

  return (
    <AnimatePresence>
      <motion.div
        className="relative bg-white/90 backdrop-blur rounded-xl p-5 overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', bounce: 0.4 }}
      >
        {/* Effect layer */}
        <EffectComponent />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <motion.span
              className="text-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: data.level_index >= 3 ? [0, -10, 10, 0] : 0
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {data.emoji}
            </motion.span>
            <motion.span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: `${data.color}30`, color: data.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.level}
            </motion.span>
          </div>

          {/* Score display */}
          <div className="text-center mb-3">
            <motion.div
              className="text-5xl font-bold"
              style={{ color: data.color }}
              animate={data.level_index >= 4 ? {
                scale: [1, 1.05, 1],
                textShadow: [
                  `0 0 10px ${data.color}`,
                  `0 0 20px ${data.color}`,
                  `0 0 10px ${data.color}`,
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {displayScore}%
            </motion.div>
            <div className="text-sm text-gray-500 mt-1">Compatibility Score</div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: data.color }}
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>

          {/* Message */}
          <motion.p
            className="text-center text-gray-700 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {data.message}
          </motion.p>

          {/* Extra flair for high compatibility */}
          {data.level_index >= 4 && (
            <motion.div
              className="text-center mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-pink-500 font-bold">
                This is rare! Don't let them go! 💕
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
