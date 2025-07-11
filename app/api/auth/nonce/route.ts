import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  // Generate random nonce
  const nonce = randomBytes(16).toString("hex")
  // Set nonce in cookie (for validation)
  const res = NextResponse.json({ nonce })
  res.cookies.set("login_nonce", nonce, { httpOnly: true, maxAge: 300, sameSite: "lax" })
  return res
}
