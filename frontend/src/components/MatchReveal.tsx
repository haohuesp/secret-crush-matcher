'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchRevealProps {
  yourAddress: string;
  matchedAddress: string;
  onClose?: () => void;
}

export default function MatchReveal({ yourAddress, matchedAddress, onClose }: MatchRevealProps) {
  const [stage, setStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timers = [
      setTimeout(() => setStage(1), 500),   // Show "IT'S A"
      setTimeout(() => setStage(2), 1500),  // Show "MATCH!"
      setTimeout(() => setStage(3), 2500),  // Show profiles
      setTimeout(() => setShowConfetti(true), 2800), // Confetti
      setTimeout(() => setStage(4), 3500),  // Show details
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Generate avatar from address
  const getAvatarEmoji = (address: string) => {
    const emojis = ['😊', '🥰', '😍', '🤗', '😇', '🥳', '😎', '🤩', '😋', '🙂'];
    const index = parseInt(address.slice(-2), 16) % emojis.length;
    return emojis[index];
  };

  const getAvatarColor = (address: string) => {
    const hue = parseInt(address.slice(2, 8), 16) % 360;
    return `hsl(${hue}, 70%, 85%)`;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-crush-pink/90 via-heart-red/80 to-crush-purple/90
                 flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FF6B9D', '#C9A7FF', '#FFD700', '#FF4D6D', '#00CED1'][i % 5],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -20, rotate: 0, opacity: 1 }}
                animate={{
                  y: '100vh',
                  rotate: Math.random() * 720 - 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: 'linear',
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating hearts background */}
      {[...Array(20)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [-10, 10, -10],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {['❤️', '💕', '💖', '💗', '💓'][i % 5]}
        </motion.span>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Stage 1: IT'S A */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.p
              className="text-white text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              IT'S A
            </motion.p>
          )}
        </AnimatePresence>

        {/* Stage 2: MATCH! */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.h1
              className="text-white text-7xl md:text-8xl font-black mb-8"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                bounce: 0.6,
                duration: 0.8,
              }}
            >
              MATCH!
              <motion.span
                className="inline-block ml-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                💕
              </motion.span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Stage 3: Profile pictures connecting */}
        <AnimatePresence>
          {stage >= 3 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {/* Your profile */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl
                           shadow-lg border-4 border-white"
                  style={{ backgroundColor: getAvatarColor(yourAddress) }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {getAvatarEmoji(yourAddress)}
                </motion.div>
                <p className="text-white mt-2 font-mono text-sm">
                  {yourAddress.slice(0, 6)}...{yourAddress.slice(-4)}
                </p>
                <p className="text-white/80 text-sm">You</p>
              </motion.div>

              {/* Heart connection */}
              <motion.div
                className="text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💘
                </motion.span>
              </motion.div>

              {/* Match profile */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl
                           shadow-lg border-4 border-white"
                  style={{ backgroundColor: getAvatarColor(matchedAddress) }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  {getAvatarEmoji(matchedAddress)}
                </motion.div>
                <p className="text-white mt-2 font-mono text-sm">
                  {matchedAddress.slice(0, 6)}...{matchedAddress.slice(-4)}
                </p>
                <p className="text-white/80 text-sm">Your Match</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Stage 4: Message and actions */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white text-xl mb-8">
                You both like each other! 🎉
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  className="px-8 py-3 bg-white text-crush-pink font-bold rounded-full
                           shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  Amazing! 💖
                </motion.button>

                <motion.button
                  className="px-8 py-3 bg-white/20 text-white font-bold rounded-full
                           border-2 border-white hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chat 💬
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.span
          key={`sparkle-${i}`}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.span>
      ))}
    </motion.div>
  );
}
