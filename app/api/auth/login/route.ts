import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const { walletAddress, signature, nonce } = await req.json();

  // 1. Validate nonce from cookie
  const cookieNonce = req.cookies.get("login_nonce")?.value;
  if (!cookieNonce || cookieNonce !== nonce) {
    return NextResponse.json({ error: "Invalid nonce" }, { status: 400 });
  }

  // 2. Validate signature
  let recovered;
  try {
    recovered = verifyMessage(nonce, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
    return NextResponse.json({ error: "Signature does not match address" }, { status: 400 });
  }

  // 3. Save user to database (Prisma)
  let user = await prisma.user.findUnique({ where: { wallet: walletAddress } });
  if (!user) {
    user = await prisma.user.create({ data: { wallet: walletAddress } });
  }

  // 4. Generate JWT session
  const token = jwt.sign(
    { userId: user.id, wallet: user.wallet },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 5. Set cookie & return success
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
  res.cookies.set("login_nonce", "", { maxAge: 0 });
  return res;
}
