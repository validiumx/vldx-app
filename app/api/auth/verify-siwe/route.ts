import { type NextRequest, NextResponse } from "next/server"
import { SiweMessage } from "siwe"
import type { User } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { message, signature, nonce, walletAddress } = await request.json()

    // Bypass SIWE verification in dev if signature is mock
    if (process.env.NODE_ENV !== "production" && signature === "0xMOCK") {
      return NextResponse.json({
        success: true,
        user: {
          id: "user_mock",
          walletAddress,
          username: "MockUser",
          profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
          permissions: { notifications: true, contacts: false },
          optedIntoOptionalAnalytics: false,
          worldIdVerified: false,
          vldxBalance: 100,
          referralCode: "MOCKREF",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    }

    // Check nonce from cookie/session
    const sessionNonce = cookies().get('siwe_nonce')?.value
    if (!sessionNonce || nonce !== sessionNonce) {
      return NextResponse.json({ success: false, error: "Nonce mismatch" }, { status: 400 })
    }

    // Verify SIWE message
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature, nonce })

    if (!fields.success) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    // Verify wallet address matches
    if (fields.data.address.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Wallet address mismatch" }, { status: 400 })
    }

    // Create or update user in database
    const user: User = await createOrUpdateUser(walletAddress)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("SIWE verification error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}

async function createOrUpdateUser(walletAddress: string): Promise<User> {
  // In a real app, this would interact with your database
  // For demo purposes, we'll create a mock user

  const user: User = {
    id: `user_${walletAddress.toLowerCase()}`,
    walletAddress: walletAddress.toLowerCase(),
    username: `User${walletAddress.slice(-4)}`,
    profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`,
    permissions: {
      notifications: true,
      contacts: false,
    },
    optedIntoOptionalAnalytics: false,
    worldIdVerified: false,
    vldxBalance: 50.0,
    referralCode: generateReferralCode(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // TODO: Save to database
  // await db.users.upsert({ where: { walletAddress }, create: user, update: user })

  return user
}

function generateReferralCode(): string {
  return "VLDX" + Math.random().toString(36).substring(2, 8).toUpperCase()
}
