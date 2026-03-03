"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

interface NarrativeTextProps {
  children: string
  className?: string
  delay?: number
  mode?: "line" | "word" | "paragraph"
  align?: "left" | "center" | "right"
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-base md:text-lg",
  md: "text-lg md:text-xl",
  lg: "text-xl md:text-2xl lg:text-3xl",
  xl: "text-2xl md:text-4xl lg:text-5xl",
}

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

export function NarrativeText({
  children,
  className = "",
  delay = 0,
  mode = "line",
  align = "center",
  size = "md",
}: NarrativeTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })

  if (mode === "paragraph") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className={`narrative-text ${sizeClasses[size]} ${alignClasses[align]} ${className}`}
      >
        <p className="max-w-2xl mx-auto leading-relaxed text-boat-cream">{children}</p>
      </motion.div>
    )
  }

  if (mode === "word") {
    const words = children.split(" ")
    return (
      <div
        ref={ref}
        className={`narrative-text-large ${sizeClasses[size]} ${alignClasses[align]} ${className} flex flex-wrap justify-center gap-x-2 gap-y-1 max-w-3xl mx-auto`}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.08,
              ease: "easeOut",
            }}
            className="inline-block text-boat-cream"
          >
            {word}
          </motion.span>
        ))}
      </div>
    )
  }

  // Line mode - split by newlines or sentences
  const lines = children
    .split(/(?<=[.!?])\s+|\\n|\n/)
    .filter((line) => line.trim().length > 0)

  return (
    <div
      ref={ref}
      className={`narrative-text ${sizeClasses[size]} ${alignClasses[align]} ${className} flex flex-col gap-4 max-w-2xl mx-auto`}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.3,
            ease: "easeOut",
          }}
          className={`leading-relaxed ${className || "text-boat-cream"}`}
        >
          {line.trim()}
        </motion.p>
      ))}
    </div>
  )
}

