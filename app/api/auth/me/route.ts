export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import type { User } from "@/lib/types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded.userId || !decoded.walletAddress) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Get user from database
    const user = await getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })
  }
}

async function getUserById(userId: string): Promise<User | null> {
  // In a real app, this would query your database
  // For demo purposes, we'll return a mock user

  return {
    id: userId,
    walletAddress: "0x" + userId.replace("user_", ""),
    username: `User${userId.slice(-4)}`,
    profilePictureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`,
    permissions: {
      notifications: true,
      contacts: false,
    },
    optedIntoOptionalAnalytics: false,
    worldIdVerified: false,
    vldxBalance: 50.0,
    referralCode: "VLDX" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
