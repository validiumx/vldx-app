export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function GET(request: NextRequest) {
  try {
    console.log("Generating nonce for authentication...")

    // Generate cryptographically secure nonce
    const nonce = crypto.randomBytes(32).toString("hex")

    // Store nonce in secure cookie with short expiration
    const cookieStore = await cookies()
    cookieStore.set("auth_nonce", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300, // 5 minutes
      path: "/",
    })

    // Also store timestamp for additional validation
    cookieStore.set("nonce_timestamp", Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300, // 5 minutes
      path: "/",
    })

    console.log("Nonce generated successfully:", nonce.substring(0, 8) + "...")

    return NextResponse.json({
      success: true,
      nonce,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Nonce generation failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate authentication nonce",
      },
      { status: 500 },
    )
  }
}
