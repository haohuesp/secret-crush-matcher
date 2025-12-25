'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompatibilityMeter from './CompatibilityMeter';

interface CompatibilityData {
  score: number;
  level: string;
  level_index: number;
  emoji: string;
  message: string;
  color: string;
}

interface CrushSubmitFormProps {
  userAddress: string;
  onSubmit: (crushAddress: string) => Promise<boolean>;
  onClose?: () => void;
}

export default function CrushSubmitForm({ userAddress, onSubmit, onClose }: CrushSubmitFormProps) {
  const [crushAddress, setCrushAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  // Fetch compatibility when valid address is entered
  const checkCompatibility = useCallback(async (targetAddress: string) => {
    if (!isValidAddress(targetAddress) || !userAddress) {
      setCompatibility(null);
      return;
    }

    if (targetAddress.toLowerCase() === userAddress.toLowerCase()) {
      setCompatibility(null);
      return;
    }

    setIsCheckingCompatibility(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/compatibility?address1=${userAddress}&address2=${targetAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        setCompatibility(data);
      }
    } catch (err) {
      console.error('Failed to check compatibility:', err);
    } finally {
      setIsCheckingCompatibility(false);
    }
  }, [userAddress]);

  // Debounce compatibility check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (crushAddress && isValidAddress(crushAddress)) {
        checkCompatibility(crushAddress);
      } else {
        setCompatibility(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [crushAddress, checkCompatibility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!crushAddress.trim()) {
      setError("Please enter your crush's wallet address");
      return;
    }

    if (!isValidAddress(crushAddress)) {
      setError("Please enter a valid wallet address (0x...)");
      return;
    }

    if (crushAddress.toLowerCase() === userAddress.toLowerCase()) {
      setError("You can't have a crush on yourself! (But self-love is important too)");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit(crushAddress);
      if (success) {
        setSubmitted(true);
      } else {
        setError("Failed to send your secret love. Please try again!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          {/* Flying letter animation */}
          <motion.div
            className="text-6xl mb-4"
            initial={{ y: 0, x: 0, rotate: 0, scale: 1 }}
            animate={{
              y: [-20, -100, -200],
              x: [0, 50, 100],
              rotate: [0, -10, -20],
              scale: [1, 0.8, 0.5],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            💌
          </motion.div>

          {/* Hearts trail */}
          <AnimatePresence>
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{ left: '50%', top: '40%' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: -i * 30 - 20,
                  x: i * 20,
                }}
                transition={{ delay: i * 0.2, duration: 1 }}
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.h2
            className="text-2xl font-bold text-crush-pink mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Sent!
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Your secret love has been sent!
            <br />
            <span className="text-crush-purple">If they like you back, magic will happen</span> ✨
          </motion.p>

          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-crush-pink to-crush-purple
                     text-white rounded-full font-semibold"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Got it! 💕
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.span
            className="text-5xl block mb-2"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💘
          </motion.span>
          <h2 className="text-2xl font-bold text-crush-pink">Send Secret Love</h2>
          <p className="text-gray-500 text-sm mt-1">
            Only they will know if you match!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Your crush's wallet address
            </label>
            <div className="relative">
              <input
                type="text"
                value={crushAddress}
                onChange={(e) => setCrushAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-crush-pink/30 rounded-xl
                         focus:border-crush-pink focus:outline-none
                         font-mono text-sm transition-colors"
                disabled={isSubmitting}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">
                {crushAddress && isValidAddress(crushAddress) ? '✅' : '💭'}
              </span>
            </div>
          </div>

          {/* Compatibility Meter */}
          <AnimatePresence mode="wait">
            {(isCheckingCompatibility || compatibility) && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CompatibilityMeter
                  data={compatibility}
                  isLoading={isCheckingCompatibility}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-500 text-sm mb-4 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Privacy note */}
          <div className="bg-crush-cream rounded-xl p-3 mb-6">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-lg">🔒</span>
              <span>
                Your submission is <strong>encrypted</strong> with FHE.
                No one can see who you like unless they like you back!
              </span>
            </p>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-crush-pink to-heart-red
                     text-white text-lg font-bold rounded-xl shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    💫
                  </motion.span>
                  Sending...
                </>
              ) : (
                <>
                  Send Secret Love 💕
                </>
              )}
            </span>
          </motion.button>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600
                   w-8 h-8 flex items-center justify-center rounded-full
                   hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
