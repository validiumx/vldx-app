import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySiweMessage, type MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js"
import crypto from "crypto"

interface VerifyRequest {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting SIWE verification...")

    const { payload, nonce }: VerifyRequest = await request.json()

    // Validate request data
    if (!payload || !nonce) {
      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "Missing payload or nonce",
        },
        { status: 400 },
      )
    }

    // Get stored nonce from cookie
    const cookieStore = await cookies()
    const storedNonce = cookieStore.get("auth_nonce")?.value
    const nonceTimestamp = cookieStore.get("nonce_timestamp")?.value

    // Validate nonce
    if (!storedNonce || storedNonce !== nonce) {
      console.error("Nonce validation failed")
      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "Invalid or expired nonce",
        },
        { status: 401 },
      )
    }

    // Check nonce age (max 5 minutes)
    if (nonceTimestamp) {
      const age = Date.now() - Number.parseInt(nonceTimestamp)
      if (age > 300000) {
        // 5 minutes
        console.error("Nonce expired")
        return NextResponse.json(
          {
            success: false,
            isValid: false,
            message: "Nonce has expired",
          },
          { status: 401 },
        )
      }
    }

    // Verify SIWE message
    console.log("Verifying SIWE message for address:", payload.address)
    const verificationResult = await verifySiweMessage(payload, nonce)

    if (!verificationResult.isValid) {
      console.error("SIWE verification failed")
      return NextResponse.json(
        {
          success: false,
          isValid: false,
          message: "SIWE signature verification failed",
        },
        { status: 401 },
      )
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex")
    const sessionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    // Store session in secure cookie
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    cookieStore.set("session_address", payload.address, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    cookieStore.set("session_expiry", sessionExpiry.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    // Clear used nonce
    cookieStore.delete("auth_nonce")
    cookieStore.delete("nonce_timestamp")

    console.log("SIWE verification successful for:", payload.address)

    return NextResponse.json({
      success: true,
      isValid: true,
      sessionToken,
      address: payload.address,
      expiresAt: sessionExpiry,
    })
  } catch (error) {
    console.error("SIWE verification error:", error)

    return NextResponse.json(
      {
        success: false,
        isValid: false,
        message: error instanceof Error ? error.message : "Verification failed",
      },
      { status: 500 },
    )
  }
}
