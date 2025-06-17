'use client';
import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      if (err.code === -32002) {
        alert('Connection request already pending. Please check MetaMask.');
      } else {
        console.error('MetaMask error:', err);
        alert('Failed to connect wallet. See console for details.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };

    checkWallet();

    // Listen for account changes
    window.ethereum?.on('accountsChanged', (accounts) => {
      setWalletAddress(accounts[0] || '');
    });

    return () => {
      // Clean up event listener on unmount
      window.ethereum?.removeAllListeners('accountsChanged');
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow text-center max-w-md mx-auto mt-10 border">
      {walletAddress ? (
        <p className="text-green-600 font-mono text-sm">
           Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
