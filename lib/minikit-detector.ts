import { MiniKit } from "@worldcoin/minikit-js"

export class MiniKitDetector {
  private static detectionAttempts = 0
  private static maxAttempts = 5
  private static detectionDelay = 1000 // 1 second

  /**
   * Enhanced MiniKit detection with retry logic
   */
  static async detectMiniKit(): Promise<{
    isAvailable: boolean
    environment: "world-app" | "development" | "unknown"
    userAgent?: string
  }> {
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : ""

    // Check for World App user agent patterns
    const isWorldApp = this.isWorldAppEnvironment(userAgent)

    // For development/testing, allow bypass
    const isDevelopment = process.env.NODE_ENV === "development"
    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost"
    const isTestEnvironment = typeof window !== "undefined" && window.location.hostname.includes("vercel.app")

    console.log("Environment detection:", {
      userAgent,
      isWorldApp,
      isDevelopment,
      isLocalhost,
      isTestEnvironment,
      nodeEnv: process.env.NODE_ENV,
    })

    // Try to detect MiniKit with retries
    const miniKitAvailable = await this.detectWithRetry()

    // Determine environment
    let environment: "world-app" | "development" | "unknown" = "unknown"

    if (isWorldApp && miniKitAvailable) {
      environment = "world-app"
    } else if (isDevelopment || isLocalhost || isTestEnvironment) {
      environment = "development"
    }

    return {
      isAvailable: miniKitAvailable || environment === "development",
      environment,
      userAgent,
    }
  }

  /**
   * Check if running in World App based on user agent
   */
  private static isWorldAppEnvironment(userAgent: string): boolean {
    const worldAppPatterns = [
      /WorldApp/i,
      /Worldcoin/i,
      /MiniKit/i,
      // Add more patterns as needed
    ]

    return worldAppPatterns.some((pattern) => pattern.test(userAgent))
  }

  /**
   * Detect MiniKit with retry logic
   */
  private static async detectWithRetry(): Promise<boolean> {
    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        console.log(`MiniKit detection attempt ${attempt + 1}/${this.maxAttempts}`)

        // Check if MiniKit is available
        if (typeof MiniKit !== "undefined" && MiniKit.isInstalled && MiniKit.isInstalled()) {
          console.log("MiniKit detected successfully")
          return true
        }

        // Wait before next attempt
        if (attempt < this.maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, this.detectionDelay))
        }
      } catch (error) {
        console.warn(`MiniKit detection attempt ${attempt + 1} failed:`, error)
      }
    }

    console.log("MiniKit detection failed after all attempts")
    return false
  }

  /**
   * Get mock MiniKit for development
   */
  static getMockMiniKit() {
    return {
      isInstalled: () => true,
      walletAddress: "0x1234567890123456789012345678901234567890",
      user: {
        username: "test_user",
        profilePictureUrl: null,
      },
      commandsAsync: {
        walletAuth: async (params: any) => {
          console.log("Mock walletAuth called with:", params)
          return {
            finalPayload: {
              status: "success",
              address: "0x1234567890123456789012345678901234567890",
              message: "Mock SIWE message",
              signature: "0xmocksignature",
            },
          }
        },
        sendTransaction: async (params: any) => {
          console.log("Mock sendTransaction called with:", params)
          return {
            transactionId: "0xmocktransactionhash",
          }
        },
      },
    }
  }
}
