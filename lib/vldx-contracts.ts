import { ethers } from "ethers"
import { VLDX_CONTRACTS, WORLD_CHAIN_CONFIG } from "./config"

// Contract addresses
export const VLDX_ADDRESS = "0x6B44699577d2EC9669802b3a4F8F91ecc4Aa8789"
export const VLDX_CLAIM_ADDRESS = "0xfA087564057A805e47C379935DCd2889c903ec3a"

// Full VLDX ABI (ERC20 + custom)
export const VLDX_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]

// Full VLDXClaim ABI
export const VLDX_CLAIM_ABI = [
  "function claim() external",
  "function canClaim(address user) view returns (bool)",
  "function lastClaimTime(address user) view returns (uint256)",
  "function claimAmount() view returns (uint256)",
]

export class VLDXContractService {
  private provider: ethers.JsonRpcProvider
  private vldxContract: ethers.Contract
  private claimContract: ethers.Contract

  constructor() {
    this.provider = new ethers.JsonRpcProvider(WORLD_CHAIN_CONFIG.rpcUrls.default.http[0])
    this.vldxContract = new ethers.Contract(VLDX_CONTRACTS.VLDX, VLDX_ABI, this.provider)
    this.claimContract = new ethers.Contract(VLDX_CONTRACTS.VLDXClaim, VLDX_CLAIM_ABI, this.provider)
  }

  async getVLDXBalance(address: string): Promise<string> {
    try {
      const balance = await this.vldxContract.balanceOf(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error("Error getting VLDX balance:", error)
      return "0"
    }
  }

  async canClaimVLDX(address: string): Promise<boolean> {
    try {
      return await this.claimContract.canClaim(address)
    } catch (error) {
      console.error("Error checking claim status:", error)
      return false
    }
  }

  async getLastClaimTime(address: string): Promise<number> {
    try {
      const timestamp = await this.claimContract.lastClaimTime(address)
      return Number(timestamp)
    } catch (error) {
      console.error("Error getting last claim time:", error)
      return 0
    }
  }

  async getClaimAmount(): Promise<string> {
    try {
      const amount = await this.claimContract.claimAmount()
      return ethers.formatEther(amount)
    } catch (error) {
      console.error("Error getting claim amount:", error)
      return "1"
    }
  }

  async getVLDXTokenInfo() {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.vldxContract.name(),
        this.vldxContract.symbol(),
        this.vldxContract.decimals(),
        this.vldxContract.totalSupply(),
      ])

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatEther(totalSupply),
        contractAddress: VLDX_CONTRACTS.VLDX,
      }
    } catch (error) {
      console.error("Error getting VLDX token info:", error)
      return {
        name: "Validium-X",
        symbol: "VLDX",
        decimals: 18,
        totalSupply: "0",
        contractAddress: VLDX_CONTRACTS.VLDX,
      }
    }
  }
}

export const vldxService = new VLDXContractService()
