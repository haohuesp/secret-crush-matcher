'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cute anime-style avatar collection
export const AVATARS = [
  { id: 'shy-girl', emoji: '🥺', bg: '#FFB6C1', name: 'Shy Girl' },
  { id: 'cool-boy', emoji: '😎', bg: '#87CEEB', name: 'Cool Boy' },
  { id: 'sweet-heart', emoji: '🥰', bg: '#FFD1DC', name: 'Sweet Heart' },
  { id: 'dreamer', emoji: '😇', bg: '#E6E6FA', name: 'Dreamer' },
  { id: 'starry-eyes', emoji: '🤩', bg: '#FFFACD', name: 'Starry Eyes' },
  { id: 'blushing', emoji: '😊', bg: '#FFDAB9', name: 'Blushing' },
  { id: 'party-lover', emoji: '🥳', bg: '#98FB98', name: 'Party Lover' },
  { id: 'mysterious', emoji: '🦊', bg: '#DDA0DD', name: 'Mysterious' },
  { id: 'angel', emoji: '👼', bg: '#F0FFF0', name: 'Angel' },
  { id: 'cupid', emoji: '💘', bg: '#FF69B4', name: 'Cupid' },
  { id: 'butterfly', emoji: '🦋', bg: '#E0FFFF', name: 'Butterfly' },
  { id: 'unicorn', emoji: '🦄', bg: '#FFE4E1', name: 'Unicorn' },
  { id: 'cat-lover', emoji: '😺', bg: '#FFF0F5', name: 'Cat Lover' },
  { id: 'bunny', emoji: '🐰', bg: '#FFFAF0', name: 'Bunny' },
  { id: 'sparkle', emoji: '✨', bg: '#F5F5DC', name: 'Sparkle' },
  { id: 'rose', emoji: '🌹', bg: '#FFE4E1', name: 'Rose' },
];

interface AvatarSelectorProps {
  currentAvatar: string | null;
  onSelect: (avatarId: string) => void;
  onClose: () => void;
}

export default function AvatarSelector({ currentAvatar, onSelect, onClose }: AvatarSelectorProps) {
  const [selected, setSelected] = useState(currentAvatar);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative glass rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.span
            className="text-4xl block mb-2"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎭
          </motion.span>
          <h2 className="text-2xl font-bold text-crush-pink">Choose Your Avatar</h2>
          <p className="text-gray-500 text-sm mt-1">Pick one that represents you!</p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-4 gap-3 max-h-[40vh] overflow-y-auto p-2">
          {AVATARS.map((avatar) => (
            <motion.button
              key={avatar.id}
              className={`relative w-full aspect-square rounded-2xl flex items-center justify-center text-3xl
                        transition-all ${selected === avatar.id
                          ? 'ring-4 ring-crush-pink ring-offset-2 scale-105'
                          : 'hover:scale-105'}`}
              style={{ backgroundColor: avatar.bg }}
              onClick={() => setSelected(avatar.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{avatar.emoji}</span>
              {selected === avatar.id && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-crush-pink rounded-full
                           flex items-center justify-center text-white text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Avatar Preview */}
        {selected && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-gray-600">
              Selected: <span className="font-bold text-crush-pink">
                {AVATARS.find(a => a.id === selected)?.name}
              </span>
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <motion.button
            className="flex-1 py-3 bg-gray-200 rounded-xl font-medium text-gray-600
                     hover:bg-gray-300 transition-colors"
            onClick={onClose}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="flex-1 py-3 bg-gradient-to-r from-crush-pink to-heart-red
                     text-white rounded-xl font-bold shadow-lg
                     hover:shadow-glow-pink transition-shadow disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!selected}
            whileTap={{ scale: 0.95 }}
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to get avatar by ID
export function getAvatarById(id: string | null) {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}
