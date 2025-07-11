"use client"

import React from "react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { MiniKitDetector } from "@/lib/minikit-detector"
import { MiniKit } from "@worldcoin/minikit-js"

interface MiniKitContextType {
  isAvailable: boolean
  isLoading: boolean
}

const MiniKitContext = React.createContext<MiniKitContextType>({
  isAvailable: false,
  isLoading: true,
})

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [detection, setDetection] = useState<{
    isAvailable: boolean
    isLoading: boolean
  }>({
    isAvailable: false,
    isLoading: true,
  })

  useEffect(() => {
    // Install MiniKit as per Worldcoin docs
    const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || ""
    if (typeof window !== "undefined" && appId) {
      try {
        MiniKit.install(appId)
        // Debug log
        // @ts-ignore
        console.log("[MiniKitProvider] Called MiniKit.install with appId:", appId)
      } catch (e) {
        // @ts-ignore
        console.error("[MiniKitProvider] MiniKit.install error:", e)
      }
    }
    detectEnvironment()
  }, [])

  const detectEnvironment = async () => {
    try {
      const result = await MiniKitDetector.detectMiniKit()
      setDetection({
        isAvailable: result.isAvailable,
        isLoading: false,
      })
    } catch (error) {
      setDetection({
        isAvailable: false,
        isLoading: false,
      })
    }
  }

  if (detection.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Detecting World App...</p>
        </div>
      </div>
    )
  }

  if (!detection.isAvailable) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-4">World App Required</h1>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
            <p className="text-gray-300 mb-4">This app only works in World App. Please open this Mini App inside World App.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MiniKitContext.Provider value={detection}>
      <div className="min-h-screen bg-black">
        {children}
      </div>
    </MiniKitContext.Provider>
  )
}

export const useMiniKitContext = () => React.useContext(MiniKitContext)
