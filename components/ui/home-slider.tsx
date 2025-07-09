"use client"
import { useState, useEffect, useRef } from "react"

const slides = [
  { img: "/images/invite.png", title: "Invite Friends", desc: "Earn rewards for inviting friends!" },
  { img: "/images/swap.jpg", title: "Swap Instantly", desc: "Convert VLDX to USDC anytime.", link: "https://app.uniswap.org/explore/tokens/worldchain/0x6b44699577d2ec9669802b3a4f8f91ecc4aa8789" },
]

export default function HomeSlider() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active])

  const handleDotClick = (i: number) => {
    setActive(i)
    timerRef.current && clearTimeout(timerRef.current)
  }

  const handleSlideClick = () => {
    if (active === 0) {
      // Copy referral link
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      const user = JSON.parse(localStorage.getItem("minikit_user") || "null")
      const referralCode = user?.referralCode || ""
      const id = user?.id || ""
      const link = `${baseUrl}?ref=${referralCode}&wid=${id}`
      navigator.clipboard.writeText(link)
      window.alert("Referral link copied!")
    } else if (active === 1 && slides[1].link) {
      window.open(slides[1].link, "_blank")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-16">
      <div className="relative rounded-2xl overflow-hidden bg-black cursor-pointer" onClick={handleSlideClick}>
        {slides[active].img ? (
          <>
            <img src={slides[active].img} alt={slides[active].title} className="w-full h-40 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
              <h3 className="text-lg font-bold text-white">{slides[active].title}</h3>
              <p className="text-sm text-gray-300">{slides[active].desc}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-black/40">
            {/* Empty slide for Claim Daily */}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${i === active ? "bg-white" : "bg-white/30"}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 