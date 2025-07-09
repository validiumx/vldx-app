"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getUserWalletAddress } from "@/lib/minikit"

interface MiniKitContextType {
  isInstalled: boolean
  isReady: boolean
  walletAddress: string | null
  error: string | null
}

const MiniKitContext = createContext<MiniKitContextType>({
  isInstalled: false,
  isReady: false,
  walletAddress: null,
  error: null,
})

export const useMiniKitContext = () => useContext(MiniKitContext)

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = () => {
      try {
        console.log("MiniKit Provider: Using mock implementation...")

        // Always succeed with mock implementation
        setIsInstalled(true)
        setIsReady(true)

        const address = getUserWalletAddress()
        setWalletAddress(address)

        console.log("MiniKit Provider: Mock initialization complete")
      } catch (err) {
        console.error("MiniKit Provider: Error:", err)
        // Always fallback to working state
        setIsInstalled(true)
        setIsReady(true)
        setWalletAddress("0x1234567890123456789012345678901234567890")
      }
    }

    // Initialize immediately
    initialize()
  }, [])

  return (
    <MiniKitContext.Provider value={{ isInstalled, isReady, walletAddress, error }}>{children}</MiniKitContext.Provider>
  )
}
