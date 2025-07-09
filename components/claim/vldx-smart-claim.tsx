"use client"

import { useState } from "react"
import Image from "next/image"
import { WorldButton } from "@/components/ui/world-button"
import { WorldCard } from "@/components/ui/world-card"
import { useVLDXClaim } from "@/hooks/use-vldx-claim"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

export function VLDXSmartClaim() {
  const { user } = useWalletAuth()
  const { claimInfo, phaseInfo, countdown, isLoading, isClaiming, error, executeClaim, canClaim } = useVLDXClaim()

  const [claimAmount, setClaimAmount] = useState("1")
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastTxHash, setLastTxHash] = useState("")

  const handleClaim = async () => {
    if (!canClaim || isClaiming || !claimAmount) return

    try {
      const result = await executeClaim(claimAmount)

      if (result.success) {
        setShowSuccess(true)
        setLastTxHash(result.transactionHash || "")

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Claim error:", error)
    }
  }

  const handleMaxClick = () => {
    if (claimInfo?.maxClaim) {
      setClaimAmount(claimInfo.maxClaim)
    }
  }

  if (isLoading) {
    return (
      <WorldCard>
        <div className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading claim information...</p>
        </div>
      </WorldCard>
    )
  }

  if (!claimInfo) {
    return (
      <WorldCard>
        <div className="p-6 text-center">
          <p className="text-red-600">Failed to load claim information</p>
          <WorldButton onClick={() => window.location.reload()} className="mt-4">
            Retry
          </WorldButton>
        </div>
      </WorldCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <WorldCard>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-green-800 font-medium">Claim Successful!</p>
                <p className="text-green-600 text-sm">{claimAmount} VLDX claimed successfully</p>
                {lastTxHash && (
                  <a
                    href={`https://worldchain-mainnet.explorer.alchemy.com/tx/${lastTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                  >
                    View Transaction →
                  </a>
                )}
              </div>
            </div>
          </div>
        </WorldCard>
      )}

      {/* Phase Information */}
      {phaseInfo && (
        <WorldCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Current Phase</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Phase {phaseInfo.phase}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{phaseInfo.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Users:</span>
              <span className="font-medium">{claimInfo.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Max Claim:</span>
              <span className="font-medium">{claimInfo.maxClaim} VLDX</span>
            </div>
          </div>
        </WorldCard>
      )}

      {/* Main Claim Interface */}
      <WorldCard>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center bg-[#b8b0a6] rounded-full overflow-hidden" style={{ boxShadow: '0 0 60px 10px rgba(255,255,255,0.35)' }}>
              <Image
                src="/images/VLDX_logo.png"
                alt="VLDX Token"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Claim VLDX Tokens</h2>
            <p className="text-gray-600 text-sm">Claim your daily VLDX tokens from the smart contract</p>
          </div>

          {/* Claim Amount Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Claim</label>
              <div className="relative">
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  min={claimInfo.minClaim}
                  max={claimInfo.maxClaim}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  disabled={!canClaim || isClaiming}
                />
                <button
                  onClick={handleMaxClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm font-medium hover:text-blue-700"
                  disabled={!canClaim || isClaiming}
                >
                  MAX
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {claimInfo.minClaim} VLDX</span>
                <span>Max: {claimInfo.maxClaim} VLDX</span>
              </div>
            </div>

            {/* Current Balance */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {Number.parseFloat(claimInfo.userBalance).toFixed(4)} VLDX
                </span>
              </div>
            </div>

            {/* Countdown or Ready Status */}
            {!canClaim && countdown ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-orange-800 font-medium">Next claim available in:</p>
                  <p className="text-2xl font-mono font-bold text-orange-900 mt-1">{countdown}</p>
                </div>
              </div>
            ) : canClaim ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-green-800 font-medium">✅ Ready to claim!</p>
                  <p className="text-green-600 text-sm">You can claim VLDX tokens now</p>
                </div>
              </div>
            ) : null}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Claim Button */}
            <WorldButton
              onClick={handleClaim}
              disabled={!canClaim || isClaiming || !claimAmount || Number.parseFloat(claimAmount) <= 0}
              loading={isClaiming}
              haptic="medium"
              className="w-full"
              size="large"
            >
              {isClaiming ? "Processing Claim..." : `Claim ${claimAmount} VLDX`}
            </WorldButton>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center">
              Claiming will mint VLDX tokens directly to your wallet via smart contract. Additional tokens are
              automatically distributed to team and ecosystem wallets.
            </p>
          </div>
        </div>
      </WorldCard>

      {/* Contract Information */}
      <WorldCard>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Smart Contract Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Contract:</span>
              <a
                href={`https://worldchain-mainnet.explorer.alchemy.com/address/0xfA087564057A805e47C379935DCd2889c903ec3a`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-mono text-xs"
              >
                0xfA08...c3a
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">World Chain Mainnet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cooldown:</span>
              <span className="font-medium">24 hours</span>
            </div>
          </div>
        </div>
      </WorldCard>
    </div>
  )
}
