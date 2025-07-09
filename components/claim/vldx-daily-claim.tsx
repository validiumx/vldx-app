"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@worldcoin/mini-apps-ui-kit-react"
import { useAuth } from "@/hooks/use-auth"
import { useVLDXClaim } from "@/hooks/use-vldx-claim"
import CountdownTimer from "@/components/ui/countdown-timer"
import LogoAnimation from "@/components/ui/logo-animation"
import { MiniKit } from "@worldcoin/minikit-js"
import { useWorldId } from "@/hooks/use-world-id"

// Helper for UNO Quick Action deeplink
const UNO_APP_ID = 'app_a4f7f3e62c1de0b9490a5260cb390b56'
const VLDX_TOKEN = '0x6B44699577d2EC9669802b3a4F8F91ecc4Aa8789'
const USDC_TOKEN = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1'
function getUnoDeeplinkUrl({ fromToken, toToken, amount, referrerAppId, referrerDeeplinkPath }: { fromToken?: string, toToken?: string, amount?: string, referrerAppId?: string, referrerDeeplinkPath?: string }) {
  let path = `?tab=swap`
  if (fromToken) {
    path += `&fromToken=${fromToken}`
    if (amount) {
      path += `&amount=${amount}`
    }
  }
  if (toToken) {
    path += `&toToken=${toToken}`
  }
  if (referrerAppId) {
    path += `&referrerAppId=${referrerAppId}`
  }
  if (referrerDeeplinkPath) {
    path += `&referrerDeeplinkPath=${encodeURIComponent(referrerDeeplinkPath)}`
  }
  const encodedPath = encodeURIComponent(path)
  return `https://worldcoin.org/mini-app?app_id=${UNO_APP_ID}&path=${encodedPath}`
}
function toBaseUnit(amount: string, decimals = 18) {
  // amount: string in decimal, decimals: number
  if (!amount) return '0'
  const [whole, frac = ''] = amount.split('.')
  return whole + (frac.padEnd(decimals, '0')).slice(0, decimals)
}

export function VLDXDailyClaim() {
  const { user } = useAuth()
  const {
    claimInfo,
    isLoading,
    isClaiming,
    error,
    executeClaim,
    canClaim,
    countdown,
    refreshClaimInfo,
  } = useVLDXClaim()
  const { isVerified } = useWorldId()
  // Remove balance state & useEffect, use claimInfo.userBalance only
  const [claimError, setClaimError] = useState<string | null>(null)
  const [justClaimed, setJustClaimed] = useState(false)
  const [justClaimedTarget, setJustClaimedTarget] = useState<Date | null>(null)

  const handleClaim = async () => {
    setClaimError(null)
    if (!claimInfo || !canClaim || isClaiming) return
    const amount = claimInfo.maxClaim
    const result = await executeClaim(amount)
    if (!result.success) {
      setClaimError(result.error || "Claim failed")
      } else {
      // Immediately show 24-hour countdown and message after claim
      const target = new Date(Date.now() + 24 * 60 * 60 * 1000)
      setJustClaimed(true)
      setJustClaimedTarget(target)
      refreshClaimInfo()
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Claim Button */}
      <div className="text-center mb-2">
        <LogoAnimation
          isActive={canClaim}
          logoSrc="/images/VLDX_logo.png"
          altText="VLDX Token"
          width={180}
          height={180}
          onClick={handleClaim}
          className="mx-auto"
        />
        {/* Verified badge above balance card */}
        {isVerified && (
          <div className="flex justify-center mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Verified
            </span>
          </div>
        )}

        <div className="mt-4">
          {justClaimed ? (
            <div className="flex flex-col items-center">
              {justClaimedTarget && <CountdownTimer targetDate={justClaimedTarget} />}
              <p className="text-base text-zinc-300 mt-2">You've already claimed today. Come back in 24 hours.</p>
            </div>
          ) : canClaim ? (
            <p className="text-lg text-gray-300">Tap to claim your daily VLDX</p>
          ) : (
            <div>
              {/* Papar countdown timer modular */}
              {(() => {
                let targetDate: Date | null = null
                if (claimInfo && claimInfo.lastClaimTime) {
                  // lastClaimTime in epoch seconds, cooldown 24 hours (86400s)
                  const nextClaimEpoch = claimInfo.lastClaimTime + 86400
                  targetDate = new Date(nextClaimEpoch * 1000)
                } else if (countdown && countdown !== "00:00:00") {
                  // Parse countdown string "HH:MM:SS" to Date
                  const [h, m, s] = countdown.split(":").map(Number)
                  const now = new Date()
                  targetDate = new Date(now.getTime() + ((h * 3600 + m * 60 + s) * 1000))
                }
                return targetDate ? <CountdownTimer targetDate={targetDate} /> : null
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl shadow bg-white/10 p-4 flex items-center mt-2 mb-2">
          <div className="w-12 h-12 relative mr-4">
            <Image src="/images/VLDX_logo.png" alt="VLDX" fill className="object-cover rounded-full" />
          </div>
          <div className="flex-1">
          {/* Username paparan */}
          <p className="font-mono text-xs text-gray-400 mb-1">
            {MiniKit.user?.username ? `@${MiniKit.user.username}` : 'Anonymous'}
          </p>
            <p className="text-sm text-gray-400">VLDX Balance</p>
          <p className="text-2xl font-bold text-white">{claimInfo ? Number.parseFloat(claimInfo.userBalance).toFixed(6) : "Loading..."}</p>
          <a
            href={claimInfo ? getUnoDeeplinkUrl({
              fromToken: VLDX_TOKEN,
              toToken: USDC_TOKEN,
              amount: toBaseUnit(claimInfo.userBalance, 18),
              referrerAppId: process.env.NEXT_PUBLIC_WORLD_APP_ID || undefined,
            }) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 underline"
          >
            Convert to USD →
          </a>
        </div>
      </div>

      {/* Claim Button */}
      <Button onClick={handleClaim} className="w-full mt-2" disabled={!canClaim || isClaiming}>
        {isClaiming ? <span>Claiming...</span> : canClaim ? "Claim VLDX" : "Already Claimed Today"}
      </Button>
      {claimError && <div className="text-red-500 text-sm text-center mt-2">{claimError}</div>}
      {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
    </div>
  )
}
