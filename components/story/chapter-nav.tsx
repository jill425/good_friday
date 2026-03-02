"use client"

import { motion } from "motion/react"

interface Chapter {
  id: string
  title: string
  number: number
}

interface ChapterNavProps {
  chapters: Chapter[]
  currentChapter: number
  onNavigate: (id: string) => void
}

export function ChapterNav({ chapters, currentChapter, onNavigate }: ChapterNavProps) {
  return (
    <nav
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-6"
      aria-label="Chapter navigation"
    >
      {chapters.map((ch) => {
        const isActive = currentChapter === ch.number
        return (
          <button
            key={ch.id}
            onClick={() => onNavigate(ch.id)}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label={`Go to Chapter ${ch.number}: ${ch.title}`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Title tooltip */}
            <span
              className={`text-xs tracking-wider uppercase font-sans transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "opacity-80 text-boat-amber"
                  : "opacity-0 group-hover:opacity-60 text-boat-pale"
              }`}
            >
              {ch.title}
            </span>

            {/* Dot indicator */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="rounded-full"
                animate={{
                  width: isActive ? 12 : 6,
                  height: isActive ? 12 : 6,
                  backgroundColor: isActive
                    ? "var(--boat-amber)"
                    : "var(--boat-pale)",
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
              />
              {isActive && (
                <motion.div
                  className="absolute rounded-full border border-boat-amber"
                  initial={{ width: 12, height: 12, opacity: 0 }}
                  animate={{ width: 24, height: 24, opacity: 0.3 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </div>
          </button>
        )
      })}
    </nav>
  )
}
