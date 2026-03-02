"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"

type Soundscape = "broken" | "gather" | "crown"

interface SoundControllerProps {
  currentSoundscape: Soundscape
}

export function SoundController({ currentSoundscape }: SoundControllerProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<Map<string, { oscillator: OscillatorNode; gain: GainNode }>>(new Map())

  const createSoundscape = useCallback(
    (ctx: AudioContext, type: Soundscape) => {
      // Clean up existing nodes
      nodesRef.current.forEach((node) => {
        try {
          node.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
          setTimeout(() => {
            try { node.oscillator.stop() } catch { /* already stopped */ }
          }, 1000)
        } catch { /* ignore */ }
      })
      nodesRef.current.clear()

      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.08
      masterGain.connect(ctx.destination)

      // Wind-like noise using detuned oscillators
      const createWind = (freq: number, vol: number) => {
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
        osc.start()

        // Modulate frequency for natural wind sound
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.1 + Math.random() * 0.3
        lfoGain.gain.value = freq * 0.3
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()

        return { oscillator: osc, gain }
      }

      // Deep ocean rumble
      const createRumble = (freq: number, vol: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.value = vol
        osc.connect(gain)
        gain.connect(masterGain)
        osc.start()

        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.05
        lfoGain.gain.value = freq * 0.2
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()

        return { oscillator: osc, gain }
      }

      const configs: Record<Soundscape, () => void> = {
        // Chapter 1: broken — low dark sawtooth + detuned beat oscillators (220Hz/223Hz)
        broken: () => {
          nodesRef.current.set("rumble1", createRumble(35, 0.06))
          nodesRef.current.set("wind1", createWind(220, 0.04))
          nodesRef.current.set("wind2", createWind(223, 0.04)) // beating interval creates tension
        },
        // Chapter 2: gather — perfect fifth drones (55Hz A + 82Hz E) + rising wind
        gather: () => {
          nodesRef.current.set("rumble1", createRumble(55, 0.05))
          nodesRef.current.set("rumble2", createRumble(82, 0.04))
          nodesRef.current.set("wind1", createWind(110, 0.03))
        },
        // Chapter 3: crown — major triad (55A + 69C# + 82E + 110A) + bright 440Hz overtone
        crown: () => {
          nodesRef.current.set("rumble1", createRumble(55, 0.05))
          nodesRef.current.set("rumble2", createRumble(69, 0.04))
          nodesRef.current.set("rumble3", createRumble(82, 0.04))
          nodesRef.current.set("rumble4", createRumble(110, 0.03))
          nodesRef.current.set("wind1", createWind(440, 0.02)) // bright shimmer
        },
      }

      configs[type]()
    },
    []
  )

  const toggleSound = useCallback(() => {
    if (!isInitialized) {
      const ctx = new AudioContext()
      audioContextRef.current = ctx
      createSoundscape(ctx, currentSoundscape)
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
  }, [isInitialized, isMuted, createSoundscape, currentSoundscape])

  // Update soundscape when chapter changes
  useEffect(() => {
    if (isInitialized && audioContextRef.current && !isMuted) {
      createSoundscape(audioContextRef.current, currentSoundscape)
    }
  }, [currentSoundscape, isInitialized, isMuted, createSoundscape])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
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
          <motion.div
            key="muted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <VolumeX size={16} className="text-boat-pale" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
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
