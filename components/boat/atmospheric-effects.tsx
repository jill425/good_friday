"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useInView } from "motion/react"
import { useRef } from "react"

/* ───────── Rain Effect ───────── */
interface RainProps {
  intensity?: "light" | "medium" | "heavy"
  className?: string
}

export function Rain({ intensity = "medium", className = "" }: RainProps) {
  const counts = { light: 40, medium: 80, heavy: 150 }
  const count = counts[intensity]

  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        height: `${15 + Math.random() * 30}px`,
        duration: `${0.4 + Math.random() * 0.6}s`,
        delay: `${Math.random() * 2}s`,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    [count]
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-30 ${className}`}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="rain-drop"
          style={{
            left: drop.left,
            height: drop.height,
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ───────── Lightning Effect ───────── */
interface LightningProps {
  frequency?: number // seconds between flashes
  className?: string
}

export function Lightning({ frequency = 8, className = "" }: LightningProps) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const interval = setInterval(
      () => {
        setFlash(true)
        setTimeout(() => setFlash(false), 200)
      },
      frequency * 1000 + Math.random() * 4000
    )
    return () => clearInterval(interval)
  }, [frequency])

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none z-25 ${className}`}
      animate={{ opacity: flash ? 0.7 : 0 }}
      transition={{ duration: flash ? 0.05 : 0.3 }}
    >
      <div className="lightning" />
    </motion.div>
  )
}

/* ───────── Fog Effect ───────── */
interface FogProps {
  layers?: number
  className?: string
}

export function Fog({ layers = 3, className = "" }: FogProps) {
  const fogLayers = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => ({
        id: i,
        duration: `${20 + i * 10}s`,
        delay: `${i * 5}s`,
        opacity: 0.15 - i * 0.03,
        scale: 1 + i * 0.3,
      })),
    [layers]
  )

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-15 ${className}`}>
      {fogLayers.map((layer) => (
        <div
          key={layer.id}
          className="fog-layer"
          style={{
            animationDuration: layer.duration,
            animationDelay: layer.delay,
            opacity: layer.opacity,
            transform: `scale(${layer.scale})`,
          }}
        />
      ))}
    </div>
  )
}

/* ───────── Waves SVG Effect ───────── */
interface WavesProps {
  className?: string
  color?: string
}

export function Waves({ className = "", color = "rgba(10, 14, 23, 0.9)" }: WavesProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 z-20 ${className}`}>
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="w-full h-24 md:h-32 lg:h-40"
        style={{ animation: "wave-motion 6s ease-in-out infinite" }}
      >
        <path
          d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.8"
        />
        <path
          d="M0,140 C280,80 560,160 720,140 C880,120 1160,180 1440,140 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.6"
          style={{ animation: "wave-motion 8s ease-in-out infinite reverse" }}
        />
        <path
          d="M0,160 C360,130 600,170 720,160 C840,150 1080,190 1440,160 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.9"
          style={{ animation: "wave-motion 10s ease-in-out infinite" }}
        />
      </svg>
    </div>
  )
}

/* ───────── Floating Particles ───────── */
interface ParticlesProps {
  count?: number
  className?: string
}

export function Particles({ count = 20, className = "" }: ParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
      })),
    [count]
  )

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-15 ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-boat-cream"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ───────── Ambient Glow ───────── */
interface GlowProps {
  color?: string
  position?: "top" | "center" | "bottom"
  className?: string
}

export function AmbientGlow({
  color = "rgba(196, 146, 58, 0.15)",
  position = "center",
  className = "",
}: GlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: "-20% 0px" })

  const positionClasses = {
    top: "top-0",
    center: "top-1/2 -translate-y-1/2",
    bottom: "bottom-0",
  }

  return (
    <motion.div
      ref={ref}
      className={`absolute left-1/2 -translate-x-1/2 ${positionClasses[position]} w-[600px] h-[600px] rounded-full pointer-events-none z-5 ${className}`}
      style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  )
}
