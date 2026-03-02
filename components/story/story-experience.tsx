"use client"

import { useState, useCallback } from "react"
import { NarrativeText } from "./narrative-text"
import { Particles, AmbientGlow } from "./atmospheric-effects"
import { ProgressBar } from "./progress-bar"
import { SoundController } from "./sound-controller"
import { IntroScreen } from "./intro-screen"
import { CrownPhoto } from "@/components/three_d/crown-photo"

export function StoryExperience() {
  const [introComplete, setIntroComplete] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  return (
    <div className="relative bg-boat-deep">
      {/* Fixed 3D crown background */}
      <CrownPhoto />

      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* Intro screen */}
      <IntroScreen onComplete={handleIntroComplete} />

      {/* Progress bar */}
      <ProgressBar />

      {/* Sound controller */}
      <SoundController />

      {/* ── Narrative ─────────────────────────────────────────── */}
      {introComplete && (
        <section className="relative z-20" style={{ minHeight: "1300vh" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
            <Particles count={20} />
            <AmbientGlow color="rgba(196, 146, 58, 0.12)" position="center" />
          </div>

          <div className="relative flex flex-col items-center gap-20 px-6 py-32 max-w-2xl mx-auto">

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

            <NarrativeText mode="paragraph" size="md" delay={0.3}>
              There is a voice that speaks into chaos — not louder than the chaos, but older.
              It named the light. It named the dry land. It called a dead man by his first name
              and he came walking out of the dark.
            </NarrativeText>

            <NarrativeText mode="word" size="lg" delay={0.2}>
              Love does not leave its broken things unfinished.
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

            <NarrativeText mode="word" size="xl" delay={0.1}>
              Not despite the breaking. Because of it.
            </NarrativeText>

            <NarrativeText mode="word" size="lg" delay={0.2}>
              The broken is not merely mended. It is crowned.
            </NarrativeText>

          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-20 h-screen flex flex-col items-center justify-center bg-boat-deep px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-px bg-boat-amber/40" />
          <p className="text-sm tracking-[0.3em] uppercase text-boat-pale/40 font-sans">
            Good Friday
          </p>
          <p className="text-xs text-boat-mist/40 font-sans text-center max-w-sm leading-relaxed">
            A meditation on suffering and glory.
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
