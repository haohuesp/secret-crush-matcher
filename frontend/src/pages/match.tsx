'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MatchReveal from '@/components/MatchReveal';

export default function MatchPage() {
  const router = useRouter();
  const { your, matched } = router.query;
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    if (your && matched) {
      setShowMatch(true);
    }
  }, [your, matched]);

  const handleClose = () => {
    router.push('/dashboard');
  };

  if (!showMatch || !your || !matched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading match...</p>
      </div>
    );
  }

  return (
    <MatchReveal
      yourAddress={your as string}
      matchedAddress={matched as string}
      onClose={handleClose}
    />
  );
}
