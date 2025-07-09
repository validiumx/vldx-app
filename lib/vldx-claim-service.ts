import { ethers } from "ethers"
import { MiniKit } from "@worldcoin/minikit-js"
import { VLDX_CLAIM_ABI, VLDX_ABI, VLDX_CLAIM_ADDRESS, VLDX_ADDRESS } from "./vldx-contracts"

export interface ClaimInfo {
  minClaim: string
  maxClaim: string
  canClaim: boolean
  lastClaimTime: number
  cooldownRemaining: number
  totalUsers: number
  userBalance: string
  phase: number
}

export interface ClaimResult {
  success: boolean
  transactionHash?: string
  newBalance?: string
  error?: string
}

export class VLDXClaimService {
  private provider: ethers.JsonRpcProvider
  private claimContract: ethers.Contract
  private vldxContract: ethers.Contract

  constructor() {
    this.provider = new ethers.JsonRpcProvider("https://rpc.worldchain.xyz")
    this.claimContract = new ethers.Contract(VLDX_CLAIM_ADDRESS, VLDX_CLAIM_ABI, this.provider)
    this.vldxContract = new ethers.Contract(VLDX_ADDRESS, VLDX_ABI, this.provider)
  }

  async getClaimInfo(userAddress: string): Promise<ClaimInfo> {
    try {
      const [minClaim, maxClaim, canClaim, lastClaimTime, cooldown, totalUsers, userBalance] = await Promise.all([
        this.claimContract.minClaim(),
        this.claimContract.getCurrentMaxClaim(),
        this.claimContract.canClaim(userAddress),
        this.claimContract.lastClaimed(userAddress),
        this.claimContract.claimCooldown(),
        this.claimContract.uniqueClaimers(),
        this.vldxContract.balanceOf(userAddress),
      ])

      const lastClaimTimestamp = Number(lastClaimTime)
      const cooldownSeconds = Number(cooldown)
      const now = Math.floor(Date.now() / 1000)

      let cooldownRemaining = 0
      if (lastClaimTimestamp > 0) {
        const nextClaimTime = lastClaimTimestamp + cooldownSeconds
        cooldownRemaining = Math.max(0, nextClaimTime - now)
      }

      // Calculate current phase based on total users
      const users = Number(totalUsers)
      let phase = 1
      if (users >= 10000) {
        phase = 3 + Math.floor((users - 10000) / 5000)
      } else if (users >= 5000) {
        phase = 2
      }

      return {
        minClaim: ethers.formatEther(minClaim),
        maxClaim: ethers.formatEther(maxClaim),
        canClaim: Boolean(canClaim),
        lastClaimTime: lastClaimTimestamp,
        cooldownRemaining,
        totalUsers: users,
        userBalance: ethers.formatEther(userBalance),
        phase,
      }
    } catch (error) {
      console.error("Error getting claim info:", error)
      throw new Error("Failed to fetch claim information")
    }
  }

  async executeClaim(amount: string): Promise<ClaimResult> {
    if (!MiniKit.isInstalled()) {
      throw new Error("MiniKit not installed")
    }
    if (!MiniKit.user?.walletAddress) {
      throw new Error("No wallet address available")
    }
    try {
      const amountWei = ethers.parseEther(amount)
      const claimInfo = await this.getClaimInfo(MiniKit.user.walletAddress)
      if (Number.parseFloat(amount) < Number.parseFloat(claimInfo.minClaim)) {
        throw new Error(`Amount must be at least ${claimInfo.minClaim} VLDX`)
      }
      if (Number.parseFloat(amount) > Number.parseFloat(claimInfo.maxClaim)) {
        throw new Error(`Amount cannot exceed ${claimInfo.maxClaim} VLDX (current phase limit)`)
      }
      if (!claimInfo.canClaim) {
        if (claimInfo.cooldownRemaining > 0) {
          const hours = Math.floor(claimInfo.cooldownRemaining / 3600)
          const minutes = Math.floor((claimInfo.cooldownRemaining % 3600) / 60)
          throw new Error(`Please wait ${hours}h ${minutes}m before claiming again`)
        }
        throw new Error("Cannot claim at this time")
      }
      // Encode function data
      const iface = new ethers.Interface(VLDX_CLAIM_ABI)
      const data = iface.encodeFunctionData("claim", [amountWei])
      // Execute transaction via MiniKit
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: VLDX_CLAIM_ADDRESS,
            abi: VLDX_CLAIM_ABI,
            functionName: "claim",
            args: [amountWei],
          },
        ],
      })
      // MiniKit payload type is not always up to date, so fallback to any
      // Log for debug
      console.log("MiniKit finalPayload:", finalPayload)
      const txHash = (finalPayload as any)?.transactionHash || (finalPayload as any)?.result?.transactionHash
      if (!txHash) {
        throw new Error("Transaction failed - no hash returned")
      }
      // Get updated balance
      const newBalance = await this.vldxContract.balanceOf(MiniKit.user.walletAddress)
      return {
        success: true,
        transactionHash: txHash,
        newBalance: ethers.formatEther(newBalance),
      }
    } catch (error: any) {
      console.error("Claim execution error:", error)
      let errorMessage = "Claim failed"
      if (error.message?.includes("InsufficientAmount")) {
        errorMessage = "Amount too low - check minimum claim limit"
      } else if (error.message?.includes("ExcessiveAmount")) {
        errorMessage = "Amount too high - check maximum claim limit"
      } else if (error.message?.includes("ClaimTooSoon")) {
        errorMessage = "Please wait before claiming again"
      } else if (error.message?.includes("AlreadyClaimed")) {
        errorMessage = "You have already claimed today"
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction cancelled by user"
      } else if (error.message) {
        errorMessage = error.message
      }
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  getPhaseInfo(totalUsers: number): { phase: number; description: string; maxClaim: number } {
    if (totalUsers < 5000) {
      return {
        phase: 1,
        description: "Early Phase - Maximum rewards!",
        maxClaim: 50,
      }
    } else if (totalUsers < 10000) {
      return {
        phase: 2,
        description: "Growth Phase - Good rewards",
        maxClaim: 5,
      }
    } else {
      const additionalPhases = Math.floor((totalUsers - 10000) / 5000)
      const maxClaim = Math.max(1, 5 - additionalPhases)
      return {
        phase: 3 + additionalPhases,
        description: "Mature Phase - Sustainable rewards",
        maxClaim,
      }
    }
  }

  formatCountdown(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }
}

export const vldxClaimService = new VLDXClaimService()
