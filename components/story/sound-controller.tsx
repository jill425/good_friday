"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"

export function SoundController() {
  const [isMuted, setIsMuted] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const startSoundscape = useCallback((ctx: AudioContext) => {
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.08
    masterGain.connect(ctx.destination)

    const createRumble = (freq: number, vol: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.value = vol
      osc.connect(gain)
      gain.connect(masterGain)
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.05
      lfoGain.gain.value = freq * 0.2
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()
      osc.start()
    }

    const createShimmer = (freq: number, vol: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      osc.type = "sawtooth"
      osc.frequency.value = freq
      filter.type = "lowpass"
      filter.frequency.value = 200
      filter.Q.value = 1
      gain.gain.value = vol
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.1
      lfoGain.gain.value = freq * 0.3
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()
      osc.start()
    }

    // Major triad drone: A + C# + E + octave A + bright shimmer
    createRumble(55, 0.05)
    createRumble(69, 0.04)
    createRumble(82, 0.04)
    createRumble(110, 0.03)
    createShimmer(440, 0.02)
  }, [])

  const toggleSound = useCallback(() => {
    if (!isInitialized) {
      const ctx = new AudioContext()
      audioContextRef.current = ctx
      startSoundscape(ctx)
      setIsInitialized(true)
      setIsMuted(false)
    } else if (audioContextRef.current) {
      if (isMuted) {
        audioContextRef.current.resume()
        setIsMuted(false)
      } else {
        audioContextRef.current.suspend()
        setIsMuted(true)
      }
    }
  }, [isInitialized, isMuted, startSoundscape])

  useEffect(() => {
    return () => { audioContextRef.current?.close() }
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
