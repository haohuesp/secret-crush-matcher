'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import useOKXWallet from '../hooks/useOKXWallet';

type ConnectionState = 'idle' | 'hover' | 'connecting' | 'connected' | 'error';

interface BlushParticle {
  id: number;
  x: number;
  y: number;
  side: 'left' | 'right';
}

interface ShyWalletConnectProps {
  onConnected?: (address: string) => void;
}

export default function ShyWalletConnect({ onConnected }: ShyWalletConnectProps) {
  const { connect, isConnecting, isConnected, address, error } = useOKXWallet();
  const [state, setState] = useState<ConnectionState>('idle');
  const [blushParticles, setBlushParticles] = useState<BlushParticle[]>([]);
  const [showSweat, setShowSweat] = useState(false);
  const [typedText, setTypedText] = useState('');

  const leftFingerControls = useAnimation();
  const rightFingerControls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);

  const fullText = "Connect your wallet to find your secret crush...";

  // Track component mount status
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Blush particles effect
  useEffect(() => {
    if (state === 'idle' || state === 'hover') {
      const interval = setInterval(() => {
        const newParticle: BlushParticle = {
          id: Date.now(),
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
          side: Math.random() > 0.5 ? 'left' : 'right',
        };
        setBlushParticles(prev => [...prev.slice(-5), newParticle]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Sweat drops occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === 'idle' || state === 'hover') {
        setShowSweat(true);
        setTimeout(() => setShowSweat(false), 1000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [state]);

  // Shy finger animation - approach and retreat
  useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;

    const shyDance = async () => {
      while (state === 'idle' && !cancelled) {
        // Approach slowly
        await Promise.all([
          leftFingerControls.start({
            x: 0,
            transition: { duration: 1.5, ease: 'easeOut' }
          }),
          rightFingerControls.start({
            x: 0,
            transition: { duration: 1.5, ease: 'easeOut' }
          })
        ]);

        if (cancelled) break;

        // Almost touch... then retreat shyly!
        await Promise.all([
          leftFingerControls.start({
            x: -30,
            transition: { duration: 0.3, ease: 'easeIn' }
          }),
          rightFingerControls.start({
            x: 30,
            transition: { duration: 0.3, ease: 'easeIn' }
          })
        ]);

        if (cancelled) break;

        // Pause nervously
        await new Promise(resolve => setTimeout(resolve, 500));

        if (cancelled) break;

        // Try again with trembling
        await Promise.all([
          leftFingerControls.start({
            x: -10,
            transition: { duration: 1, ease: 'easeOut' }
          }),
          rightFingerControls.start({
            x: 10,
            transition: { duration: 1, ease: 'easeOut' }
          })
        ]);

        if (cancelled) break;

        // Retreat again!
        await Promise.all([
          leftFingerControls.start({
            x: -40,
            transition: { duration: 0.2, ease: 'easeIn' }
          }),
          rightFingerControls.start({
            x: 40,
            transition: { duration: 0.2, ease: 'easeIn' }
          })
        ]);

        if (cancelled) break;

        await new Promise(resolve => setTimeout(resolve, 800));
      }
    };

    if (state === 'idle') {
      shyDance();
    }

    return () => {
      cancelled = true;
    };
  }, [state, isMounted, leftFingerControls, rightFingerControls]);

  // Handle connection
  const handleConnect = async () => {
    setState('connecting');

    // Fingers finally touch!
    await Promise.all([
      leftFingerControls.start({
        x: 5,
        transition: { duration: 0.5, ease: 'easeOut' }
      }),
      rightFingerControls.start({
        x: -5,
        transition: { duration: 0.5, ease: 'easeOut' }
      })
    ]);

    try {
      await connect();
      setState('connected');
      if (address && onConnected) {
        onConnected(address);
      }
    } catch (err) {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  // Update state when connection status changes
  useEffect(() => {
    if (isConnected && address) {
      setState('connected');
      if (onConnected) {
        onConnected(address);
      }
    }
  }, [isConnected, address, onConnected]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-crush-cream via-blush/30 to-crush-purple/20 z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-crush-pink mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Secret Crush Matcher
        </motion.h1>

        <motion.p
          className="text-crush-purple text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Powered by magic (and encryption)
        </motion.p>

        {/* Shy Fingers Animation Container */}
        <div className="relative w-80 h-48 mb-8 flex items-center justify-center">
          {/* Left Hand & Finger */}
          <motion.div
            className="absolute left-0 shy-hand"
            initial={{ x: -60 }}
            animate={leftFingerControls}
          >
            <div className="relative">
              {/* Hand */}
              <motion.div
                className="text-7xl"
                animate={state === 'idle' ? {
                  rotate: [-2, 2, -2],
                } : {}}
                transition={{
                  duration: 0.3,
                  repeat: state === 'idle' ? Infinity : 0,
                }}
              >
                <span className="inline-block transform -scale-x-100"></span>
              </motion.div>

              {/* Blush effect left */}
              <AnimatePresence>
                {blushParticles.filter(p => p.side === 'left').map(particle => (
                  <motion.div
                    key={particle.id}
                    className="absolute -top-2 -right-4 w-6 h-3 rounded-full bg-pink-300/60"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </AnimatePresence>

              {/* Sweat drop */}
              <AnimatePresence>
                {showSweat && (
                  <motion.span
                    className="absolute -top-4 right-2 text-2xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    💧
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Shy emoji face */}
          <motion.div
            className="absolute top-0 text-3xl"
            animate={{
              y: [0, -5, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {state === 'connected' ? '😍' : state === 'error' ? '😵' : '>///<'}
          </motion.div>

          {/* Right Hand & Finger */}
          <motion.div
            className="absolute right-0 shy-hand"
            initial={{ x: 60 }}
            animate={rightFingerControls}
          >
            <div className="relative">
              {/* Hand */}
              <motion.div
                className="text-7xl"
                animate={state === 'idle' ? {
                  rotate: [2, -2, 2],
                } : {}}
                transition={{
                  duration: 0.3,
                  repeat: state === 'idle' ? Infinity : 0,
                }}
              >

              </motion.div>

              {/* Blush effect right */}
              <AnimatePresence>
                {blushParticles.filter(p => p.side === 'right').map(particle => (
                  <motion.div
                    key={particle.id}
                    className="absolute -top-2 -left-4 w-6 h-3 rounded-full bg-pink-300/60"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sparkles when connecting/connected */}
          <AnimatePresence>
            {(state === 'connecting' || state === 'connected') && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos(i * 45 * Math.PI / 180) * 60,
                      y: Math.sin(i * 45 * Math.PI / 180) * 60,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: state === 'connected' ? 0 : Infinity,
                    }}
                  >
                    ✨
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Heart explosion on connected */}
          <AnimatePresence>
            {state === 'connected' && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.span
                    key={`heart-${i}`}
                    className="absolute text-3xl"
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: Math.cos(i * 30 * Math.PI / 180) * 120,
                      y: Math.sin(i * 30 * Math.PI / 180) * 120 - 50,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.05,
                    }}
                  >
                    {['❤️', '💕', '💖', '💗'][i % 4]}
                  </motion.span>
                ))}

                {/* Big heart in center */}
                <motion.div
                  className="absolute text-6xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                  transition={{ duration: 0.8, ease: 'backOut' }}
                >
                  💖
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Dizzy stars on error */}
          <AnimatePresence>
            {state === 'error' && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={`star-${i}`}
                    className="absolute text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      rotate: 360,
                      x: Math.cos((i * 120 + Date.now() / 10) * Math.PI / 180) * 40,
                      y: -30 + Math.sin((i * 120 + Date.now() / 10) * Math.PI / 180) * 20,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Typewriter text */}
        <motion.p
          className="text-gray-600 text-lg mb-6 h-7 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {typedText}
          <span className="animate-pulse">|</span>
        </motion.p>

        {/* Connect Button */}
        <AnimatePresence mode="wait">
          {state !== 'connected' ? (
            <motion.button
              key="connect-btn"
              className="relative px-8 py-4 bg-gradient-to-r from-crush-pink to-crush-purple
                       text-white text-xl font-semibold rounded-full shadow-lg
                       hover:shadow-glow-pink transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       overflow-hidden group"
              onClick={handleConnect}
              disabled={isConnecting || state === 'connecting'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => state === 'idle' && setState('hover')}
              onHoverEnd={() => state === 'hover' && setState('idle')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />

              <span className="relative flex items-center gap-2">
                {state === 'connecting' ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      💫
                    </motion.span>
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Wallet
                    <motion.span
                      animate={{ x: [0, 3, 0, -3, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      👉👈
                    </motion.span>
                  </>
                )}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="connected"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="px-6 py-3 bg-green-100 border-2 border-green-400 rounded-full
                         text-green-700 font-semibold flex items-center gap-2"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <span className="text-2xl">✅</span>
                Connected!
              </motion.div>

              <motion.p
                className="text-gray-500 text-sm font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-4 text-red-500 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Oops! {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-float">💕</div>
        <div className="absolute top-20 right-10 text-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute bottom-20 right-20 text-2xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>💗</div>
      </div>
    </div>
  );
}
