"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "motion/react"

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
  offset?: [string, string]
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
  offset = ["start end", "end start"],
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as [string, string],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100])
  const y = useSpring(rawY, { stiffness: 100, damping: 30, mass: 0.5 })

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}
