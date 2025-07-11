import { MiniKit } from "@worldcoin/minikit-js";
import { SiweMessage } from "siwe";

// Login function for Validium-X Mini App using Worldcoin MiniKit and SIWE
export async function login() {
  // 1. Get nonce from backend
  const nonceRes = await fetch("/api/auth/nonce");
  if (!nonceRes.ok) throw new Error("Failed to get nonce from backend");
  const { nonce } = await nonceRes.json();

  // 2. Get wallet address from MiniKit (must use correct API)
  const walletAddress = await MiniKit.getWalletAddress();
  if (!walletAddress) throw new Error("Wallet address not found");

  // 3. Prepare SIWE message
  const siweMessage = new SiweMessage({
    domain: window.location.host,
    address: walletAddress,
    statement: "Login to Validium-X Mini App",
    uri: window.location.origin,
    version: "1",
    chainId: 480,
    nonce,
  });
  const message = siweMessage.prepareMessage();

  // 4. Trigger walletAuth via MiniKit (log result for debugging)
  const result = await MiniKit.commandsAsync.walletAuth({ nonce });
  console.log("MiniKit walletAuth result:", result);
  console.log("MiniKit walletAuth finalPayload:", result.finalPayload);

  // Extract actual fields from MiniKit finalPayload (based on real output)
  // Please check your browser console for the actual property names after running this code.
  // Example destructuring (update these fields after checking the logs):
  const { address, signature } = result.finalPayload || {};
  if (!signature || !address) {
    throw new Error("Wallet authentication failed");
  }

  // 5. Verify SIWE message with backend
  const verifyRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for session cookie
    body: JSON.stringify({
      message, // SIWE message string
      signature, // signature from MiniKit
      walletAddress: address, // wallet address from MiniKit
    }),
  });
  if (!verifyRes.ok) {
    // Try to get error message from backend
    let errorMsg = "SIWE verification failed";
    try {
      const err = await verifyRes.json();
      if (err && err.error) errorMsg = err.error;
    } catch {}
    throw new Error(errorMsg);
  }

  // 6. Get user info or token from backend response
  const user = await verifyRes.json();

  // 7. Validate backend response (domain, expiration, etc. if returned)
  if (user.domain && user.domain !== window.location.host) {
    throw new Error("Domain mismatch in backend response");
  }
  if (user.expirationTime && new Date(user.expirationTime) < new Date()) {
    throw new Error("Session expired");
  }

  // 8. Return user info (or just wallet address)
  return {
    walletAddress: address,
    ...user, // include any additional user info from backend
  };
}