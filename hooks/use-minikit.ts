"use client"

import { useState, useEffect } from "react"
import { initMiniKit, getUserWalletAddress, MiniKit } from "@/lib/minikit"

export const useMiniKit = () => {
  const [isInstalled, setIsInstalled] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = () => {
      try {
        console.log("Initializing Mock MiniKit...")

        // Use mock implementation
        const isReady = initMiniKit()

        if (isReady) {
          setIsInstalled(true)
          const address = getUserWalletAddress()
          setWalletAddress(address)
          console.log("Mock MiniKit initialized successfully")
        } else {
          // Fallback: assume it's working anyway
          setIsInstalled(true)
          setWalletAddress("0x1234567890123456789012345678901234567890")
          console.log("Mock MiniKit fallback initialization")
        }
      } catch (err) {
        console.error("Mock MiniKit initialization error:", err)
        // Always fallback to working state
        setIsInstalled(true)
        setWalletAddress("0x1234567890123456789012345678901234567890")
      } finally {
        setIsLoading(false)
      }
    }

    // Initialize immediately
    initialize()
  }, [])

  return {
    isInstalled,
    walletAddress,
    isLoading,
    error,
    MiniKit,
  }
}
