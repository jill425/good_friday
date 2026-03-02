"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { NarrativeText, ChapterTitle } from "./narrative-text"
import { Particles, AmbientGlow } from "./atmospheric-effects"
import { ChapterNav } from "./chapter-nav"
import { ProgressBar } from "./progress-bar"
import { SoundController } from "./sound-controller"
import { IntroScreen } from "./intro-screen"
import { CrownScene } from "./crown-scene"

const CHAPTERS = [
  { id: "chapter-1", title: "破碎", number: 1 },
  { id: "chapter-2", title: "拼湊", number: 2 },
  { id: "chapter-3", title: "冠冕", number: 3 },
] as const

type Soundscape = "broken" | "gather" | "crown"

const SOUNDSCAPE_MAP: Record<number, Soundscape> = {
  1: "broken",
  2: "gather",
  3: "crown",
}

export function StoryExperience() {
  const [currentChapter, setCurrentChapter] = useState<1 | 2 | 3>(1)
  const [introComplete, setIntroComplete] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const ch1Ref = useRef<HTMLElement>(null)
  const ch2Ref = useRef<HTMLElement>(null)
  const ch3Ref = useRef<HTMLElement>(null)

  // Track current chapter and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2

      // Determine chapter
      const sections = [
        { ref: ch1Ref, num: 1 },
        { ref: ch2Ref, num: 2 },
        { ref: ch3Ref, num: 3 },
      ]

      let activeChapter: 1 | 2 | 3 = 1
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].ref.current
        if (el && el.offsetTop <= scrollPos) {
          activeChapter = sections[i].num as 1 | 2 | 3
          break
        }
      }
      setCurrentChapter(activeChapter)

      // Compute chapter-2 scroll progress (0 → 1 across its full height)
      const ch2El = ch2Ref.current
      if (ch2El) {
        const top = ch2El.offsetTop
        const height = ch2El.offsetHeight
        const progress = Math.max(0, Math.min(1, (window.scrollY - top) / (height - window.innerHeight)))
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  return (
    <div className="relative bg-boat-deep">
      {/* Fixed Three.js Crown background (z-0) */}
      <CrownScene chapter={currentChapter} scrollProgress={scrollProgress} />

      {/* Grain texture overlay (z-1000) */}
      <div className="grain-overlay" />

      {/* Intro screen */}
      <IntroScreen onComplete={handleIntroComplete} />

      {/* Progress bar */}
      <ProgressBar />

      {/* Chapter navigation */}
      {introComplete && (
        <ChapterNav
          chapters={[...CHAPTERS]}
          currentChapter={currentChapter}
          onNavigate={handleNavigate}
        />
      )}

      {/* Sound controller */}
      <SoundController currentSoundscape={SOUNDSCAPE_MAP[currentChapter]} />

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 1: 破碎                        */}
      {/* ═══════════════════════════════════════ */}
      <section
        id="chapter-1"
        ref={ch1Ref}
        className="relative z-20 min-h-screen"
        style={{ minHeight: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
          {/* Chapter 1 atmospheric */}
          <Particles count={12} />
        </div>
        <div className="relative flex flex-col items-center gap-16 px-6 py-20 max-w-2xl mx-auto">
          <ChapterTitle chapter={1} title="破碎" />

          <NarrativeText mode="word" size="xl" delay={0.1}>
            Before the beginning, there was the breaking.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            Every crown begins as ore — raw, scattered, shapeless. Long before it rests on any
            brow it lies broken in the earth, indistinguishable from rubble. What we call ruin
            is often the first movement of making.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            On Good Friday the world did not know it was watching a coronation. It saw only
            the splintered wood, the torn flesh, the silence where laughter had been.
            It mistook the forge for the grave.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            Even the disciples could not see past the breaking.
          </NarrativeText>
        </div>
      </section>

      {/* Transition */}
      <div className="relative z-20 h-[30vh] bg-gradient-to-b from-transparent via-boat-deep/60 to-transparent" />

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 2: 拼湊                        */}
      {/* ═══════════════════════════════════════ */}
      <section
        id="chapter-2"
        ref={ch2Ref}
        className="relative z-20"
        style={{ minHeight: "500vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none" />
        <div className="relative flex flex-col items-center gap-16 px-6 py-20 max-w-2xl mx-auto">
          <ChapterTitle chapter={2} title="拼湊" />

          <NarrativeText mode="word" size="xl" delay={0.1}>
            The pieces did not reassemble themselves. They were called.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            There is a voice that speaks into chaos — not louder than the chaos, but older.
            It named the light. It named the dry land. It called a dead man by his first name
            and he came walking out of the dark.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            The scattered fragments of Friday did not drift together by accident. Something
            — Someone — was gathering. Piece by piece, sorrow by sorrow, the shape of something
            new was emerging in the void between the breaking and the dawn.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            Love does not leave its broken things unfinished.
          </NarrativeText>
        </div>
      </section>

      {/* Transition */}
      <div className="relative z-20 h-[30vh] bg-gradient-to-b from-transparent via-boat-deep/60 to-transparent" />

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 3: 冠冕                        */}
      {/* ═══════════════════════════════════════ */}
      <section
        id="chapter-3"
        ref={ch3Ref}
        className="relative z-20"
        style={{ minHeight: "400vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
          {/* Crown glow overlay */}
          <div className="absolute inset-0 crown-glow-overlay" />
          <Particles count={30} />
          <AmbientGlow color="rgba(196, 146, 58, 0.18)" position="center" />
        </div>
        <div className="relative flex flex-col items-center gap-16 px-6 py-20 max-w-2xl mx-auto">
          <ChapterTitle chapter={3} title="冠冕" />

          <NarrativeText mode="word" size="xl" delay={0.1}>
            Not despite the breaking. Because of it.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            The crown they pressed down in mockery became the crown that could not be taken away.
            Every thorn that drew blood became the point of a diadem. Suffering, when it passes
            through the hands of God, is not destroyed — it is transfigured.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            This is the audacity of Good Friday: that the worst humanity could do became the
            instrument of the greatest glory ever revealed. The cross was not a defeat from which
            resurrection recovered. It was itself the victory, hidden in plain sight, waiting
            for Sunday to make it plain.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            The broken is not merely mended. It is crowned.
          </NarrativeText>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER                                  */}
      {/* ═══════════════════════════════════════ */}
      <footer className="relative z-20 h-screen flex flex-col items-center justify-center bg-boat-deep px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-px bg-boat-amber/40" />
          <p className="text-sm tracking-[0.3em] uppercase text-boat-pale/40 font-sans">
            Good Friday
          </p>
          <p className="text-xs text-boat-mist/40 font-sans text-center max-w-sm leading-relaxed">
            A meditation on suffering and glory. Scroll-driven interactive experience.
          </p>
          <div className="w-16 h-px bg-boat-amber/40" />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-8 text-xs tracking-[0.2em] uppercase text-boat-pale/50 hover:text-boat-amber transition-colors cursor-pointer font-sans"
          >
            Return to the beginning
          </button>
        </div>
      </footer>
    </div>
  )
}
