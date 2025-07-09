"use client"

import { useState } from "react"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { useAuth } from "@/hooks/use-auth"
import { useMiniKit } from "@/hooks/use-minikit"

export function WalletConnect() {
  const { login, isLoading } = useAuth()
  const { isInstalled, walletAddress } = useMiniKit()
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setError(null)
      await login()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
    }
  }

  if (!isInstalled) {
    return (
      <WorldCard>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-2">World App Required</h3>
          <p className="text-gray-600 mb-4">This app requires World App to function properly.</p>
          <WorldButton onClick={() => window.open("https://worldcoin.org/download", "_blank")}>
            Download World App
          </WorldButton>
        </div>
      </WorldCard>
    )
  }

  return (
    <WorldCard>
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 mb-4">Connect your World App wallet to access Validium-X features.</p>

        {walletAddress && (
          <p className="text-sm text-gray-500 mb-4">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <WorldButton onClick={handleConnect} loading={isLoading} haptic="medium">
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </WorldButton>
      </div>
    </WorldCard>
  )
}
