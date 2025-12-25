import { useState, useEffect, useCallback } from 'react';

interface WalletSession {
  address: string;
  chainId: string;
  connected: boolean;
}

interface OKXWalletHook {
  session: WalletSession | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | null;
}

// OKX Connect UI instance (lazy loaded)
let okxUIInstance: any = null;

export function useOKXWallet(): OKXWalletHook {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize OKX UI
  const initOKXUI = useCallback(async () => {
    if (okxUIInstance) return okxUIInstance;

    try {
      // Dynamic import for client-side only
      const { OKXUniversalConnectUI } = await import('@okxconnect/ui');

      okxUIInstance = await OKXUniversalConnectUI.init({
        dappMetaData: {
          name: "Secret Crush Matcher",
          icon: "https://i.imgur.com/xxxxxx.png" // Replace with actual icon
        },
        actionsConfiguration: {
          returnStrategy: 'none',
          modals: 'all'
        },
        language: 'en_US',
      });

      return okxUIInstance;
    } catch (err) {
      console.error('Failed to initialize OKX UI:', err);
      return null;
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('crush_wallet_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('crush_wallet_session');
      }
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const okxUI = await initOKXUI();

      if (!okxUI) {
        // Fallback: simulate connection for demo/development
        const mockAddress = '0x' + Array(40).fill(0).map(() =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const newSession: WalletSession = {
          address: mockAddress,
          chainId: '1',
          connected: true
        };

        setSession(newSession);
        localStorage.setItem('crush_wallet_session', JSON.stringify(newSession));
        return;
      }

      // Real OKX connection
      const result = await okxUI.openModal({
        namespaces: {
          eip155: {
            chains: ["eip155:1", "eip155:137", "eip155:56"],
            defaultChain: "1"
          }
        }
      });

      if (result && result.namespaces?.eip155?.accounts?.[0]) {
        const fullAddress = result.namespaces.eip155.accounts[0];
        // Format: "eip155:1:0x..."
        const address = fullAddress.split(':')[2];

        const newSession: WalletSession = {
          address,
          chainId: '1',
          connected: true
        };

        setSession(newSession);
        localStorage.setItem('crush_wallet_session', JSON.stringify(newSession));
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');

      // Demo fallback on error
      if (process.env.NODE_ENV === 'development') {
        const mockAddress = '0x' + Array(40).fill(0).map(() =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const newSession: WalletSession = {
          address: mockAddress,
          chainId: '1',
          connected: true
        };

        setSession(newSession);
        localStorage.setItem('crush_wallet_session', JSON.stringify(newSession));
        setError(null);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [initOKXUI]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setSession(null);
    localStorage.removeItem('crush_wallet_session');

    if (okxUIInstance) {
      try {
        okxUIInstance.disconnect();
      } catch (e) {
        console.log('Disconnect error:', e);
      }
    }
  }, []);

  return {
    session,
    isConnecting,
    isConnected: session?.connected ?? false,
    error,
    connect,
    disconnect,
    address: session?.address ?? null
  };
}

export default useOKXWallet;
