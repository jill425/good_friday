"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"

export function SoundController() {
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleSound = useCallback(() => {
    if (!isInitialized) {
      const audio = new Audio('/sounds/cello-circle.m4a')
      audio.loop = true
      audio.volume = 0.7
      audio.play().catch(e => console.error("Audio playback failed:", e))
      audioRef.current = audio

      setIsInitialized(true)
      setIsMuted(false)
    } else if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e))
        setIsMuted(false)
      } else {
        audioRef.current.pause()
        setIsMuted(true)
      }
    }
  }, [isInitialized, isMuted])

  // 頁面載入後自動播放；若瀏覽器擋下，偵測第一次互動再播放
  useEffect(() => {
    const audio = new Audio('/sounds/cello-circle.m4a')
    audio.loop = true
    audio.volume = 0.7
    audioRef.current = audio
    setIsInitialized(true)

    audio.play().catch(() => {
      // 瀏覽器自動播放被擋，等使用者第一次互動
      const resume = () => {
        audio.play().catch(() => { })
        window.removeEventListener("click", resume)
        window.removeEventListener("scroll", resume)
        window.removeEventListener("touchstart", resume)
      }
      window.addEventListener("click", resume, { once: true })
      window.addEventListener("scroll", resume, { once: true })
      window.addEventListener("touchstart", resume, { once: true })
    })

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  return (
    <motion.button
      onClick={toggleSound}
      className="fixed bottom-6 right-4 md:right-8 z-50 flex items-center gap-2 px-3 py-2 rounded-full border border-boat-storm/50 bg-boat-deep/80 backdrop-blur-sm cursor-pointer hover:border-boat-amber/40 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      <AnimatePresence mode="wait">
        {isMuted ? (
          <motion.div key="muted" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <VolumeX size={16} className="text-boat-pale" />
          </motion.div>
        ) : (
          <motion.div key="unmuted" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <Volume2 size={16} className="text-boat-amber" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-xs font-sans text-boat-pale hidden md:inline">
        {isMuted ? "Sound Off" : "Sound On"}
      </span>
    </motion.button>
  )
}
