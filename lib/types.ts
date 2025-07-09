export interface User {
  walletAddress?: string
  username?: string
  profilePictureUrl?: string
  permissions?: {
    notifications: boolean
    contacts: boolean
  }
  optedIntoOptionalAnalytics?: boolean
  worldAppVersion?: number
  deviceOS?: string
  // Additional fields for our app
  id?: string
  worldIdVerified?: boolean
  vldxBalance?: number
  lastClaimTime?: string
  referralCode?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

export interface SiwePayload {
  message: string
  signature: string
  nonce: string
  walletAddress: string
}

export interface ClaimResult {
  success: boolean
  newBalance: number
  nextClaimTime: string
}

export interface PaymentRequest {
  to: string
  value: string
  description: string
}

export interface VerificationResult {
  verified: boolean
  nullifierHash: string
  proof: string
}

export interface VLDXContracts {
  VLDX: string
  VLDXLiquidity: string
  VLDXSwapper: string
  VLDXClaim: string
}
