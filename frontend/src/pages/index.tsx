'use client';

import { useRouter } from 'next/router';
import ShyWalletConnect from '@/components/ShyWalletConnect';

export default function Home() {
  const router = useRouter();

  const handleConnected = (address: string) => {
    // Wait for animation to complete, then navigate
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen">
      <ShyWalletConnect onConnected={handleConnected} />
    </main>
  );
}
