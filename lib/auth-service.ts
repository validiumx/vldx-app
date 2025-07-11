import { MiniKit } from "@worldcoin/minikit-js"

export interface AuthUser {
  walletAddress: string
  username?: string
  profilePictureUrl?: string
  isAuthenticated: boolean
  sessionToken?: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
  sessionToken?: string
}

export class AuthService {
  private static readonly STORAGE_KEY = "vldx_auth_session"
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

  /**
   * Main wallet authentication method using SIWE
   */
  static async authenticateWithWallet(): Promise<AuthResponse> {
    try {
      console.log("Starting wallet authentication...")

      // Step 1: Check MiniKit availability
      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit is not available. Please open this app in World App.")
      }

      // Step 2: Get nonce from backend
      console.log("Fetching nonce from backend...")
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!nonceResponse.ok) {
        throw new Error(`Failed to get nonce: ${nonceResponse.status}`)
      }

      const { nonce, success } = await nonceResponse.json()

      if (!success || !nonce) {
        throw new Error("Invalid nonce response from server")
      }

      console.log("Nonce received:", nonce.substring(0, 8) + "...")

      // Step 3: Perform wallet authentication
      console.log("Initiating wallet authentication...")
      const authResult = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + this.SESSION_DURATION),
        notBefore: new Date(Date.now() - 60000), // 1 minute ago
        statement: "Sign in to Validium-X Mini App to access your account and claim VLDX tokens.",
        uri: window.location.origin,
        version: "1",
        chainId: 1, // Ethereum mainnet
      })

      console.log("Wallet auth result:", authResult.finalPayload.status)

      // Step 4: Check authentication result
      if (authResult.finalPayload.status === "error") {
        throw new Error(authResult.finalPayload.errorMessage || "Wallet authentication failed")
      }

      if (authResult.finalPayload.status !== "success") {
        throw new Error("Wallet authentication was not successful")
      }

      // Step 5: Verify SIWE signature on backend
      console.log("Verifying SIWE signature...")
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: authResult.finalPayload,
          nonce,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error(`SIWE verification failed: ${verifyResponse.status}`)
      }

      const verifyResult = await verifyResponse.json()

      if (!verifyResult.success || !verifyResult.isValid) {
        throw new Error(verifyResult.message || "SIWE signature verification failed")
      }

      // Step 6: Create user session
      const user: AuthUser = {
        walletAddress: authResult.finalPayload.address,
        username: MiniKit.user?.username,
        profilePictureUrl: MiniKit.user?.profilePictureUrl,
        isAuthenticated: true,
        sessionToken: verifyResult.sessionToken,
      }

      // Step 7: Store session locally
      this.storeSession(user)

      console.log("Authentication successful for:", user.walletAddress)

      return {
        success: true,
        user,
        sessionToken: verifyResult.sessionToken,
      }
    } catch (error) {
      console.error("Authentication failed:", error)

      // Clear any existing session on error
      this.clearSession()

      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      }
    }
  }

  /**
   * Check if user has valid session
   */
  static async checkAuthStatus(): Promise<AuthResponse> {
    try {
      // Check local session first
      const localSession = this.getStoredSession()
      if (!localSession) {
        return { success: false, error: "No local session found" }
      }

      // Verify session with backend
      const response = await fetch("/api/auth/status", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localSession.sessionToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        this.clearSession()
        return { success: false, error: "Session validation failed" }
      }

      const result = await response.json()

      if (!result.success || !result.isValid) {
        this.clearSession()
        return { success: false, error: "Invalid session" }
      }

      return {
        success: true,
        user: localSession,
      }
    } catch (error) {
      console.error("Auth status check failed:", error)
      this.clearSession()
      return { success: false, error: "Auth status check failed" }
    }
  }

  /**
   * Logout user and clear session
   */
  static async logout(): Promise<boolean> {
    try {
      const session = this.getStoredSession()

      if (session?.sessionToken) {
        // Notify backend about logout
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.sessionToken}`,
            "Content-Type": "application/json",
          },
        })
      }

      this.clearSession()
      return true
    } catch (error) {
      console.error("Logout failed:", error)
      this.clearSession() // Clear local session anyway
      return false
    }
  }

  /**
   * Store session in localStorage
   */
  private static storeSession(user: AuthUser): void {
    try {
      const sessionData = {
        ...user,
        timestamp: Date.now(),
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error("Failed to store session:", error)
    }
  }

  /**
   * Get stored session from localStorage
   */
  private static getStoredSession(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const sessionData = JSON.parse(stored)

      // Check if session is expired
      if (Date.now() - sessionData.timestamp > this.SESSION_DURATION) {
        this.clearSession()
        return null
      }

      return sessionData
    } catch (error) {
      console.error("Failed to get stored session:", error)
      this.clearSession()
      return null
    }
  }

  /**
   * Clear stored session
   */
  private static clearSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear session:", error)
    }
  }
}
