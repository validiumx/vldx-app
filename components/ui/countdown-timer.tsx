"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

function calculateTimeLeft(targetDate: Date) {
  const difference = targetDate.getTime() - new Date().getTime()
  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }
  return {
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="mt-4">
      <p className="text-sm text-zinc-400 mb-2">Next claim available in:</p>
      <div className="flex items-end gap-4 justify-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-mono font-bold text-white">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="text-xs text-zinc-400">hours</span>
        </div>
        <span className="text-2xl font-mono font-bold text-white mb-2">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-mono font-bold text-white">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span className="text-xs text-zinc-400">mins</span>
        </div>
        <span className="text-2xl font-mono font-bold text-white mb-2">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-mono font-bold text-white">{timeLeft.seconds.toString().padStart(2, "0")}</span>
          <span className="text-xs text-zinc-400">secs</span>
        </div>
      </div>
    </div>
  )
} 