import { MiniKit } from "@worldcoin/minikit-js"
import { SiweMessage } from "siwe"
import type { User, SiwePayload } from "@/lib/types"

export class WalletAuthService {
  /**
   * Get user information by wallet address using MiniKit
   */
  static async getUserByAddress(address: string): Promise<User | null> {
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not installed")
      }

      // Mock user data - in production, this would come from your database
      return {
        walletAddress: address,
        username: `User${address.slice(-4)}`,
        profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        permissions: {
          notifications: true,
          contacts: false,
        },
        optedIntoOptionalAnalytics: false,
        worldAppVersion: 1,
        deviceOS: "iOS",
      }
    } catch (error) {
      console.error("Error getting user by address:", error)
      return null
    }
  }

  /**
   * Get user information by username using MiniKit
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit not installed")
      }

      // Mock implementation
      return {
        walletAddress: "0x" + Math.random().toString(16).substring(2, 42),
        username: username,
        profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        permissions: {
          notifications: true,
          contacts: false,
        },
        optedIntoOptionalAnalytics: false,
        worldAppVersion: 1,
        deviceOS: "iOS",
      }
    } catch (error) {
      console.error("Error getting user by username:", error)
      return null
    }
  }

  /**
   * Initiate wallet authentication using SIWE
   */
  static async initiateWalletAuth(): Promise<SiwePayload> {
    // Only allow in World App (MiniKit)
    if (typeof window === "undefined" || !MiniKit.isInstalled()) {
      alert("MiniKit is only available in the World App. Please open this application via the World App.");
      throw new Error("MiniKit not installed or not in World App");
    }

    // Strict domain & origin check (Worldcoin Developer Dashboard values)
    const expectedDomain = "vldx-app.vercel.app";
    const expectedOrigin = "https://vldx-app.vercel.app";
    if (window.location.host !== expectedDomain || window.location.origin !== expectedOrigin) {
      alert("Domain or redirect URI mismatch. Please access this app from the correct World App link.");
      throw new Error("Domain or redirect URI does not match Worldcoin Developer Dashboard settings.");
    }

    // Get wallet address from MiniKit.user (v1.2 best practice)
    const walletAddress = MiniKit.user?.walletAddress || null;
    if (!walletAddress) {
      throw new Error("No wallet address available");
    }

    try {
      // Get nonce from backend
      const nonceResponse = await fetch("/api/auth/nonce");
      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce");
      }
      const { nonce } = await nonceResponse.json();

      // Create SIWE message (English, best practice)
      const siweMessage = new SiweMessage({
        domain: expectedDomain,
        address: walletAddress,
        statement: "Login to Validium-X Mini App",
        uri: expectedOrigin,
        version: "1",
        chainId: 480, // World Chain
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });
      const message = siweMessage.prepareMessage();

      // Use MiniKit v1.2 walletAuth (best practice)
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: "Login to Validium-X Mini App",
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      // result: { commandPayload, finalPayload }
      const payload = result?.finalPayload;
      if (!payload || payload.status !== 'success' || !payload.signature || !payload.address || !payload.message) {
        throw new Error("Wallet authentication failed");
      }
      return {
        message: payload.message,
        signature: payload.signature,
        nonce,
        walletAddress: payload.address,
      };
    } catch (error) {
      console.error("Wallet auth initiation error:", error);
      throw error;
    }
  }

  /**
   * Complete wallet authentication
   */
  static async completeWalletAuth(payload: SiwePayload): Promise<User> {
    try {
      const response = await fetch("/api/auth/verify-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Authentication failed")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Authentication failed")
      }

      return result.user
    } catch (error) {
      console.error("Wallet auth completion error:", error)
      throw error
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        return null
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        localStorage.removeItem("auth_token")
        return null
      }

      const result = await response.json()
      return result.user
    } catch (error) {
      console.error("Get current user error:", error)
      localStorage.removeItem("auth_token")
      return null
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        await fetch("/api/auth/signout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      localStorage.removeItem("auth_token")
    }
  }
}
