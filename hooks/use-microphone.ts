import { useState, useCallback } from "react"

/**
 * useMicrophone hook for World App MiniKit (v1.9.6+) and World App 2.8.85+
 * Handles permission, stream, and toggling mic on/off according to World docs
 */
export function useMicrophone() {
  const [isMicOn, setIsMicOn] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleMicrophone = useCallback(async () => {
    if (isMicOn) {
      // Stop microphone access
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      setIsMicOn(false)
      setError(null)
    } else {
      // Start microphone access
      try {
        // Request permission from user
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setStream(newStream)
        setIsMicOn(true)
        setError(null)
      } catch (err: any) {
        // Standard: show clear, mobile-friendly error message
        setError(
          err?.name === "NotAllowedError"
            ? "Microphone access denied. Please enable microphone for this app in your device and World App settings."
            : "Unable to access microphone. Please check your device settings."
        )
        setIsMicOn(false)
        setStream(null)
      }
    }
  }, [isMicOn, stream])

  // Stop mic if component unmounts (standard mobile UX)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => { if (stream) stream.getTracks().forEach((t) => t.stop()) }, [stream])

  return { isMicOn, stream, error, toggleMicrophone }
}
