"use client"

import { useEffect, useState } from "react"
import { WalletConnect } from "@/components/auth/wallet-connect"
import { UserProfile } from "@/components/auth/user-profile"
import { WorldIdVerify } from "@/components/verification/world-id-verify"
import { VLDXDailyClaim } from "@/components/claim/vldx-daily-claim"
import { VLDXReferralSystem } from "@/components/referral/vldx-referral-system"
import { useAuth } from "@/hooks/use-auth"
import { useMiniKit } from "@/hooks/use-minikit"
import { ethers } from "ethers"
import { toast } from "sonner"
import { VLDX_CONTRACTS } from "@/lib/config"
import { VLDX_ABI } from "@/lib/vldx-contracts"
import LogoAnimation from "@/components/ui/logo-animation"
import HomeSlider from "@/components/ui/home-slider"

function useVldxBalance(address?: string | null) {
  const [balance, setBalance] = useState<string | null>(null)
  useEffect(() => {
    if (!address) return
    async function fetchBalance() {
      try {
        const provider = new ethers.JsonRpcProvider("https://worldchain-mainnet.g.alchemy.com/public")
        const contract = new ethers.Contract(VLDX_CONTRACTS.VLDX, VLDX_ABI, provider)
        const bal = await contract.balanceOf(address)
        const dec = await contract.decimals()
        setBalance(ethers.formatUnits(bal, dec))
      } catch (err) {
        setBalance(null)
        console.error("Failed to fetch VLDX balance", err)
      }
    }
    fetchBalance()
  }, [address])
  return balance
}

export default function ValidiumXHomePage() {
  const { user, isAuthenticated, login, isLoading: isAuthLoading } = useAuth()
  const { isInstalled, isLoading } = useMiniKit()
  const [activeTab, setActiveTab] = useState<"home" | "referral" | "about">("home")
  const [copied, setCopied] = useState(false)

  // Dapatkan VLDX balance sebenar dari contract
  const vldxBalance = useVldxBalance(user?.walletAddress)

  // Generate referral link (same as VLDXReferralSystem)
  const generateReferralLink = () => {
    if (!user) return ""
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}?ref=${user.referralCode}&wid=${user.id}`
  }

  // Handler for slider click
  const handleSliderClick = async () => {
    if (!user) return
    const link = generateReferralLink()
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast.success("Pautan disalin ke clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Gagal salin pautan")
    }
  }

  // Splash screen: show if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8">
            <LogoAnimation
              logoSrc="/images/base_logo.png"
              altText="Validium-X Logo"
              width={160}
              height={160}
              className="mx-auto"
            />
          </div>
          <div className="mb-2 text-2xl font-bold text-center">The Backbone of Crypto</div>
          <div className="mb-8 text-gray-400 text-center">Powered by Validium-X</div>
          {/* WorldIdVerify prompt dipadam terus */}
          <button
            onClick={login}
            disabled={isAuthLoading}
            className="mt-6 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition disabled:opacity-60"
          >
            {isAuthLoading ? "Memproses..." : "Log Masuk dengan World ID"}
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading Validium-X...</p>
        </div>
      </div>
    )
  }

  if (!isInstalled || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <WalletConnect />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        {/* <div className="p-4 text-center border-b border-gray-800">
          <h1 className="text-2xl font-bold">Validium-X</h1>
          <p className="text-gray-400 text-sm">The Backbone of Crypto</p>
        </div> */}

        {/* User Profile */}
        {user && (
          <div className="p-4 flex flex-col items-center">
            {/* <UserProfile user={user} compact /> */}
            {/* Kad welcome dipadam atas permintaan user */}
          </div>
        )}

        {/* Tab Navigation */}
        {/* Padam/komen WorldIdVerify di sini */}
        {/* {!user?.worldIdVerified && (
          <WorldIdVerify
            action="claim-daily-vldx"
            onSuccess={() => {
              window.location.reload()
            }}
          />
        )} */}
        <div className="flex bg-gray-900 m-4 rounded-full p-1">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "home" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "about" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {activeTab === "home" && (
            <>
              <VLDXDailyClaim />
              <HomeSlider />
            </>
          )}

          {activeTab === "about" && (
            <div className="flex flex-col flex-grow items-center justify-center text-center min-h-[60vh]">
              <h2 className="text-2xl font-bold mb-4">About Validium-X</h2>
              <p className="max-w-xl text-gray-300 mb-8">
                Validium-X is a blockchain technology built on WorldChain, designed to be the backbone of secure, fast, and decentralized digital finance. With a focus on integrity, high performance, and security, Validium-X powers a stronger, more reliable digital economy, paving the way for limitless innovation.
              </p>
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <LogoAnimation
                    logoSrc="/images/base_logo.png"
                    altText="Validium-X Logo"
                    width={128}
                    height={128}
                    className="mx-auto"
                  />
                </div>
                <div className="mb-2 text-lg font-semibold">The Backbone of Crypto</div>
                <div className="mb-8 text-gray-400 text-sm">Powered by Validium-X</div>
                <div className="flex gap-4 justify-center">
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.53 6.477h3.181l-6.953 7.965 6.953 8.081h-5.463l-4.312-5.01-4.924 5.01H2.5l7.37-7.497L2.5 6.477h5.635l3.98 4.62 4.415-4.62zm-1.04 14.04h2.19l-5.98-6.96-6.01 6.96h2.19l3.82-3.89 3.79 3.89z" />
                    </svg>
                  </a>
                  <a
                    href="https://t.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.036 16.572l-.396 5.59c.567 0 .813-.244 1.11-.537l2.664-2.53 5.522 4.04c1.012.557 1.73.264 1.98-.937l3.594-16.84c.327-1.51-.547-2.1-1.53-1.74L2.36 9.27c-1.48.58-1.46 1.41-.252 1.78l4.59 1.433 10.65-6.7c.5-.32.96-.14.58.2" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/validiumx/VLDX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481C19.138 20.204 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* Padam footer VLDX Contract dan World Chain Mainnet */}
        {/*
        <div className="p-4 text-center text-gray-500 text-xs border-t border-gray-800 mt-8">
          <p>VLDX Contract: 0x6B44...8789</p>
          <p>World Chain Mainnet</p>
        </div>
        */}
      </div>
    </div>
  )
}
