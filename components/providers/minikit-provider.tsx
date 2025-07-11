"use client"

import React from "react"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { MiniKitDetector } from "@/lib/minikit-detector"

interface MiniKitContextType {
  isAvailable: boolean
  environment: "world-app" | "development" | "unknown"
  isLoading: boolean
}

const MiniKitContext = React.createContext<MiniKitContextType>({
  isAvailable: false,
  environment: "unknown",
  isLoading: true,
})

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [detection, setDetection] = useState<{
    isAvailable: boolean
    environment: "world-app" | "development" | "unknown"
    isLoading: boolean
  }>({
    isAvailable: false,
    environment: "unknown",
    isLoading: true,
  })

  useEffect(() => {
    detectEnvironment()
  }, [])

  const detectEnvironment = async () => {
    try {
      console.log("Starting MiniKit environment detection...")

      const result = await MiniKitDetector.detectMiniKit()

      console.log("Detection result:", result)

      setDetection({
        isAvailable: result.isAvailable,
        environment: result.environment,
        isLoading: false,
      })

      // Set up mock MiniKit for development
      if (result.environment === "development" && typeof window !== "undefined") {
        console.log("Setting up mock MiniKit for development")
        ;(window as any).MiniKit = MiniKitDetector.getMockMiniKit()
      }
    } catch (error) {
      console.error("Environment detection failed:", error)
      setDetection({
        isAvailable: false,
        environment: "unknown",
        isLoading: false,
      })
    }
  }

  if (detection.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Detecting environment...</p>
          <p className="text-gray-400 text-sm mt-2">Checking for World App...</p>
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
          <h1 className="text-xl font-bold text-white mb-4">Environment Not Supported</h1>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
            <p className="text-gray-300 mb-4">This app is designed to run in World App environment.</p>
            <div className="text-left text-sm text-gray-400 space-y-1">
              <p>• Environment: {detection.environment}</p>
              <p>• User Agent: {typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 50) : "N/A"}...</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={detectEnvironment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Retry Detection
            </button>
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={() => {
                  ;(window as any).MiniKit = MiniKitDetector.getMockMiniKit()
                  setDetection({
                    isAvailable: true,
                    environment: "development",
                    isLoading: false,
                  })
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Use Development Mode
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <MiniKitContext.Provider value={detection}>
      <div className="min-h-screen bg-black">
        {detection.environment === "development" && (
          <div className="bg-yellow-900/50 border-b border-yellow-700 p-2 text-center">
            <p className="text-yellow-300 text-sm">🚧 Development Mode - Using Mock MiniKit</p>
          </div>
        )}
        {children}
      </div>
    </MiniKitContext.Provider>
  )
}

export const useMiniKit = () => React.useContext(MiniKitContext)
