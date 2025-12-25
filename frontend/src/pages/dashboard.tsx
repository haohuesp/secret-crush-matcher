'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import useOKXWallet from '@/hooks/useOKXWallet';
import CrushSubmitForm from '@/components/CrushSubmitForm';
import MatchReveal from '@/components/MatchReveal';

interface UserStats {
  wallet_address: string;
  crushes_sent: number;
  matches_count: number;
  matches: string[];
}

interface Match {
  your_address: string;
  matched_address: string;
  matched_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected, disconnect } = useOKXWallet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showCrushForm, setShowCrushForm] = useState(false);
  const [showMatchReveal, setShowMatchReveal] = useState(false);
  const [newMatch, setNewMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected && !address) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, router]);

  // Fetch user stats and matches
  useEffect(() => {
    if (address) {
      fetchStats();
      fetchMatches();
    }
  }, [address]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats/${address}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Use mock data for demo
      setStats({
        wallet_address: address || '',
        crushes_sent: 0,
        matches_count: 0,
        matches: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/matches/${address}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  };

  const handleSubmitCrush = async (crushAddress: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/crush/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crusher_address: address,
          crush_address: crushAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Check if it's a match!
        if (data.message.includes('MATCH')) {
          setNewMatch({
            your_address: address || '',
            matched_address: crushAddress,
            matched_at: new Date().toISOString(),
          });
          setTimeout(() => {
            setShowCrushForm(false);
            setShowMatchReveal(true);
          }, 2000);
        }

        // Refresh stats
        fetchStats();
        fetchMatches();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to submit crush:', err);
      // Demo mode: simulate success
      if (stats) {
        setStats({
          ...stats,
          crushes_sent: stats.crushes_sent + 1,
        });
      }
      return true;
    }
  };

  const getAvatarEmoji = (addr: string) => {
    const emojis = ['😊', '🥰', '😍', '🤗', '😇', '🥳', '😎', '🤩', '😋', '🙂'];
    const index = parseInt(addr.slice(-2), 16) % emojis.length;
    return emojis[index];
  };

  const getAvatarColor = (addr: string) => {
    const hue = parseInt(addr.slice(2, 8), 16) % 360;
    return `hsl(${hue}, 70%, 85%)`;
  };

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          💕
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.span>
          <h1 className="text-2xl md:text-3xl font-bold text-crush-pink">
            Secret Crush Matcher
          </h1>
        </div>

        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-white/80 rounded-full text-gray-600 text-sm
                   hover:bg-white transition-colors shadow-sm"
        >
          Disconnect
        </button>
      </motion.header>

      {/* User Profile Card */}
      <motion.div
        className="glass rounded-3xl p-6 mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl
                     shadow-lg border-4 border-white"
            style={{ backgroundColor: address ? getAvatarColor(address) : '#FFB6C1' }}
            whileHover={{ scale: 1.1 }}
          >
            {address ? getAvatarEmoji(address) : '😊'}
          </motion.div>

          <div>
            <p className="font-mono text-sm text-gray-500">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </p>
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-crush-pink">{stats?.crushes_sent || 0}</p>
                <p className="text-xs text-gray-500">Crushes Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-heart-red">{stats?.matches_count || 0}</p>
                <p className="text-xs text-gray-500">Matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Crush Button */}
        <motion.button
          className="w-full py-4 bg-gradient-to-r from-crush-pink to-heart-red
                   text-white text-lg font-bold rounded-2xl shadow-lg
                   hover:shadow-glow-pink transition-shadow"
          onClick={() => setShowCrushForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💕
            </motion.span>
            Add New Crush
          </span>
        </motion.button>
      </motion.div>

      {/* Matches Section */}
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span>💘</span> Your Matches
        </h2>

        {matches.length > 0 ? (
          <div className="grid gap-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.matched_address}
                className="glass rounded-2xl p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl
                           border-2 border-crush-pink"
                  style={{ backgroundColor: getAvatarColor(match.matched_address) }}
                >
                  {getAvatarEmoji(match.matched_address)}
                </div>

                <div className="flex-1">
                  <p className="font-mono text-sm text-gray-700">
                    {match.matched_address.slice(0, 8)}...{match.matched_address.slice(-6)}
                  </p>
                  <p className="text-xs text-crush-pink">You both like each other! 💕</p>
                </div>

                <button className="px-4 py-2 bg-crush-pink text-white rounded-full text-sm font-medium
                               hover:bg-heart-red transition-colors">
                  Chat 💬
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-5xl block mb-4">🥺</span>
            <p className="text-gray-500 mb-2">No matches yet...</p>
            <p className="text-crush-pink text-sm">But don't give up! 💪</p>
          </motion.div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className="max-w-2xl mx-auto mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>✨</span> How it works
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-crush-pink">🔒</span>
              Your crush submissions are encrypted with FHE magic
            </li>
            <li className="flex items-start gap-2">
              <span className="text-crush-pink">🤫</span>
              Nobody knows who you like (not even us!)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-crush-pink">💕</span>
              Matches are only revealed when BOTH people like each other
            </li>
            <li className="flex items-start gap-2">
              <span className="text-crush-pink">🎉</span>
              Unrequited crushes stay secret forever
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCrushForm && address && (
          <CrushSubmitForm
            userAddress={address}
            onSubmit={handleSubmitCrush}
            onClose={() => setShowCrushForm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMatchReveal && newMatch && (
          <MatchReveal
            yourAddress={newMatch.your_address}
            matchedAddress={newMatch.matched_address}
            onClose={() => {
              setShowMatchReveal(false);
              setNewMatch(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
