"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"

export function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleSound = useCallback((e: React.MouseEvent) => {
    // 防止 window click 的 resume 監聽器同時觸發
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => { })
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  // 頁面載入後自動播放；若瀏覽器擋下，等第一次 touchstart / click 再播放
  // （scroll 不被現代行動瀏覽器視為有效的使用者手勢，無法解鎖 autoplay）
  useEffect(() => {
    const audio = new Audio('/sounds/cello-circle.m4a')
    audio.loop = true
    audio.volume = 0.8
    audioRef.current = audio

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        const resume = () => {
          audio.play().then(() => setIsPlaying(true)).catch(() => { })
        }
        window.addEventListener("touchstart", resume, { once: true })
        window.addEventListener("click", resume, { once: true })
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
      transition={{ delay: 0.8, duration: 0.6 }}
      aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div key="playing" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <Volume2 size={16} className="text-boat-amber" />
          </motion.div>
        ) : (
          <motion.div key="paused" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <VolumeX size={16} className="text-boat-pale" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-xs font-sans text-boat-pale hidden md:inline">
        {isPlaying ? "播放音樂" : "播放音樂"}
      </span>
    </motion.button>
  )
}
