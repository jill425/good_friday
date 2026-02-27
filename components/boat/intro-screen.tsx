"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { Particles } from "./atmospheric-effects"

interface IntroScreenProps {
  onComplete: () => void
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShow(false)
        setTimeout(onComplete, 800)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/intro-ocean.jpg"
              alt=""
              fill
              className="object-cover ink-wash-dark"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-boat-deep/60 via-boat-deep/40 to-boat-deep/80" />
          </div>

          <Particles count={30} />

          {/* Title content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.6, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="w-24 h-px bg-boat-amber"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xs tracking-[0.4em] uppercase font-sans text-boat-pale"
            >
              An Interactive Graphic Novel
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold text-boat-cream text-center tracking-wide text-balance"
              style={{ fontFamily: "var(--font-libre)" }}
            >
              The Lighthouse Keeper
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.6, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="w-24 h-px bg-boat-amber"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-sm font-sans text-boat-pale max-w-md text-center leading-relaxed"
            >
              A story of solitude, duty, and the relentless sea
            </motion.p>
          </div>

          {/* Scroll prompt */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase font-sans text-boat-pale/60">
              Scroll to begin
            </span>
            <motion.div
              className="w-px h-8 bg-gradient-to-b from-boat-amber/60 to-transparent"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
