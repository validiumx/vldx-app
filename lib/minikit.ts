import { MiniKit } from "@worldcoin/minikit-js"

export const initMiniKit = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false
  // Hanya check MiniKit production
  if (typeof MiniKit !== "undefined" && MiniKit.isInstalled && MiniKit.isInstalled()) {
    return true
  }
  return false
}

export const checkMiniKitSupport = async (): Promise<boolean> => {
  return await initMiniKit()
}

export const getUserWalletAddress = async (): Promise<string | null> => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return null
  try {
    return MiniKit.user?.walletAddress || null
  } catch {
    return null
  }
}

export const sendHapticFeedback = async (type: "light" | "medium" | "heavy" = "light") => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return
  try {
    MiniKit?.commands?.sendHapticFeedback?.({ haptic: type })
  } catch {}
}

export const shareContent = async (text: string, url?: string) => {
  const isSupported = await checkMiniKitSupport()
  if (!isSupported) return
  try {
    MiniKit?.commands?.share?.({ text, url })
  } catch {}
}
