"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"


/* ───────── Floating Particles ───────── */
interface ParticlesProps {
  count?: number
  className?: string
}

export function Particles({ count = 20, className = "" }: ParticlesProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: number; duration: number; delay: number }>>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
      }))
    )
  }, [count])

  if (reducedMotion) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
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
      className={`absolute left-1/2 -translate-x-1/2 ${positionClasses[position]} w-[min(600px,100vw)] h-[min(600px,100vw)] rounded-full pointer-events-none z-0 ${className}`}
      style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  )
}
