import { type NextRequest, NextResponse } from "next/server"
import { generateNonce } from "siwe"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const nonce = generateNonce()
    cookies().set('siwe_nonce', nonce, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
    return NextResponse.json({
      success: true,
      nonce,
    })
  } catch (error) {
    console.error("Nonce generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate nonce" }, { status: 500 })
  }
}
