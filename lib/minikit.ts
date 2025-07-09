import { MiniKit } from "@worldcoin/minikit-js"

let miniKitInitialized = false
let initializationPromise: Promise<boolean> | null = null

export const initMiniKit = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false

  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve) => {
    // For development, always resolve true
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("Development mode: MiniKit initialized")
      miniKitInitialized = true
      resolve(true)
      return
    }

    // Check if we're in World App environment without calling MiniKit functions
    const isInWorldApp =
      navigator.userAgent.includes("WorldApp") ||
      navigator.userAgent.includes("World App") ||
      window !== window.top ||
      (window.innerWidth <= 768 && "ontouchstart" in window)

    if (isInWorldApp) {
      // Wait for MiniKit to be available
      const checkMiniKit = () => {
        try {
          // Don't call MiniKit.isInstalled() as it might throw the error
          // Just check if MiniKit object exists
          if (typeof MiniKit !== "undefined" && MiniKit) {
            console.log("MiniKit is available")
            miniKitInitialized = true
            resolve(true)
          } else {
            // Retry after a short delay
            setTimeout(checkMiniKit, 100)
          }
        } catch (error) {
          console.log("MiniKit not ready yet, retrying...")
          setTimeout(checkMiniKit, 100)
        }
      }

      // Start checking
      checkMiniKit()

      // Fallback: assume it's ready after 3 seconds
      setTimeout(() => {
        if (!miniKitInitialized) {
          console.log("MiniKit fallback: assuming ready")
          miniKitInitialized = true
          resolve(true)
        }
      }, 3000)
    } else {
      // Not in World App
      resolve(false)
    }
  })

  return initializationPromise
}

export const checkMiniKitSupport = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false

  // Always return true for development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return true
  }

  // Wait for initialization
  return await initMiniKit()
}

export const getUserWalletAddress = async (): Promise<string | null> => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return null

  try {
    // Only access MiniKit.user.walletAddress if we're sure it's ready
    return MiniKit.user?.walletAddress || null
  } catch (error) {
    console.log("Could not get wallet address:", error)
    return null
  }
}

export const sendHapticFeedback = async (type: "light" | "medium" | "heavy" = "light") => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return

  try {
    MiniKit?.commands?.sendHapticFeedback?.({
      haptic: type,
    })
  } catch (error) {
    console.log("Haptic feedback not available:", error)
  }
}

export const shareContent = async (text: string, url?: string) => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return

  try {
    MiniKit?.commands?.share?.({
      text,
      url,
    })
  } catch (error) {
    console.log("Share not available:", error)
    // Fallback to native share if available
    if (navigator.share) {
      navigator.share({ text, url })
    }
  }
}
