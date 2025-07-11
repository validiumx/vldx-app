import { MiniKit } from "@worldcoin/minikit-js"

export class MiniKitDetector {
  /**
   * Detect MiniKit ONLY in World App (production)
   */
  static async detectMiniKit(): Promise<{
    isAvailable: boolean
    userAgent?: string
  }> {
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : ""
    const isWorldApp = this.isWorldAppEnvironment(userAgent)
    const miniKitAvailable = await this.detectWithRetry()
    return {
      isAvailable: isWorldApp && miniKitAvailable,
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
    ]
    return worldAppPatterns.some((pattern) => pattern.test(userAgent))
  }

  /**
   * Detect MiniKit with retry logic
   */
  private static async detectWithRetry(): Promise<boolean> {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        if (typeof MiniKit !== "undefined" && MiniKit.isInstalled && MiniKit.isInstalled()) {
          return true
        }
        if (attempt < 4) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch {}
    }
    return false
  }
}
