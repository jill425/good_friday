"use client"

import { useState, useEffect, useCallback } from "react"
import { Scene } from "./scene"
import { NarrativeText, ChapterTitle } from "./narrative-text"
import { Rain, Lightning, Fog, Waves, Particles, AmbientGlow } from "./atmospheric-effects"
import { ChapterNav } from "./chapter-nav"
import { ProgressBar } from "./progress-bar"
import { SoundController } from "./sound-controller"
import { IntroScreen } from "./intro-screen"

const CHAPTERS = [
  { id: "chapter-1", title: "The Calm", number: 1 },
  { id: "chapter-2", title: "The Warning", number: 2 },
  { id: "chapter-3", title: "The Storm", number: 3 },
  // { id: "chapter-4", title: "The Rescue", number: 4 },
  // { id: "chapter-5", title: "The Dawn", number: 5 },
] as const

type Soundscape = "calm" | "warning" | "storm" | "rescue" | "dawn"

const SOUNDSCAPE_MAP: Record<number, Soundscape> = {
  1: "calm",
  2: "warning",
  3: "storm",
  4: "rescue",
  5: "dawn",
}

export function StoryExperience() {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [introComplete, setIntroComplete] = useState(false)

  // Track current chapter based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = CHAPTERS.map((ch) => document.getElementById(ch.id))
      const scrollPos = window.scrollY + window.innerHeight / 2

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setCurrentChapter(i + 1)
          break
        }
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
      {/* Grain texture overlay */}
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
      {/* CHAPTER 1: THE CALM                    */}
      {/* ═══════════════════════════════════════ */}
      <Scene
        id="chapter-1"
        scrollHeight="400vh"
        layers={[
          {
            src: "/images/ch1-lighthouse-calm.jpg",
            speed: 0.1,
            overlay:
              "linear-gradient(to bottom, rgba(5,8,16,0.4), rgba(10,14,23,0.3), rgba(5,8,16,0.6))",
          },
          {
            speed: 0.3,
            children: (
              <AmbientGlow color="rgba(196, 146, 58, 0.12)" position="center" />
            ),
          },
        ]}
      >
        <div className="flex flex-col items-center gap-16 px-6 py-20">
          <ChapterTitle chapter={1} title="The Calm" />

          <NarrativeText mode="paragraph" size="md" delay={0.2}>
            The evening settled over the headland like a held breath. Below the cliffs, the sea lay
            still as poured lead, its surface broken only by the slow pulse of distant swells.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            Elias climbed the iron staircase as he had done ten thousand times before. Each step rang
            out in the hollow tower, a familiar hymn of rust and duty. At the top, the great lens
            waited, cold and dark.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            He struck the match. The flame caught. The world turned gold.
          </NarrativeText>

          <Particles count={15} />
          <Fog layers={2} />
        </div>
      </Scene>

      {/* Transition */}
      <div className="relative h-[50vh] bg-gradient-to-b from-boat-deep via-boat-ocean to-boat-deep" />

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 2: THE WARNING                 */}
      {/* ═══════════════════════════════════════ */}
      <Scene
        id="chapter-2"
        scrollHeight="400vh"
        layers={[
          {
            src: "/images/ch2-warning-clouds.jpg",
            speed: 0.1,
            overlay:
              "linear-gradient(to bottom, rgba(5,8,16,0.3), rgba(26,39,68,0.4), rgba(5,8,16,0.5))",
          },
          {
            speed: 0.2,
            children: <Fog layers={3} />,
          },
        ]}
      >
        <div className="flex flex-col items-center gap-16 px-6 py-20">
          <ChapterTitle chapter={2} title="The Warning" />

          <NarrativeText mode="paragraph" size="md" delay={0.2}>
            He saw them first as a thickening along the horizon: clouds stacked like fortress walls,
            their bases flat and black as spilled ink. The barometer had been falling since noon.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            Through the telescope, he counted three ships. A cargo steamer, heavy in the water. A
            fishing trawler running late. And something smaller, further out, whose lights flickered
            like a guttering candle.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            The wind shifted. The air tasted of iron and salt.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            Elias checked the oil reserves, inspected the clockwork mechanism, wound the fog horn.
            He had lived through forty storms in this tower. His hands knew the preparations even when
            his mind wandered to darker places.
          </NarrativeText>

          <Rain intensity="light" />
          <Waves color="rgba(10, 14, 23, 0.85)" />
        </div>
      </Scene>

      {/* Transition */}
      <div className="relative h-[50vh] bg-gradient-to-b from-boat-deep via-boat-storm to-boat-deep">
        <Rain intensity="medium" />
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 3: THE STORM                   */}
      {/* ═══════════════════════════════════════ */}
      <Scene
        id="chapter-3"
        scrollHeight="500vh"
        layers={[
          {
            src: "/images/ch3-storm.jpg",
            speed: 0.05,
            overlay:
              "linear-gradient(to bottom, rgba(5,8,16,0.2), rgba(5,8,16,0.3), rgba(5,8,16,0.5))",
          },
          {
            src: "/images/ch3-lightning.jpg",
            speed: 0.15,
            className: "opacity-30 mix-blend-screen",
          },
          {
            speed: 0.25,
            children: (
              <>
                <Rain intensity="heavy" />
                <Lightning frequency={6} />
              </>
            ),
          },
        ]}
      >
        <div className="flex flex-col items-center gap-16 px-6 py-20">
          <ChapterTitle chapter={3} title="The Storm" />

          <NarrativeText mode="word" size="xl" delay={0.1}>
            It came like the end of the world.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            The first wave struck the base of the cliff with a sound like cannon fire. Spray erupted
            a hundred feet into the air, drenching the gallery windows. The tower shuddered. The
            lens trembled in its mercury bath.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            Wind screamed through every crack and seam, a voice that rose and fell but never ceased.
            Rain drove sideways, each drop a tiny hammer against the glass. Elias gripped the
            railing and watched the sea transform into a landscape of moving mountains.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            The light. He had to keep the light burning.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            The clockwork mechanism groaned under the strain. Oil sloshed in the reservoir as the
            tower swayed. Elias fed the flame with steady hands, though every nerve in his body
            screamed to take shelter. Out there, in the black chaos of the sea, lives depended on
            this single point of gold.
          </NarrativeText>

          <Waves color="rgba(26, 39, 68, 0.9)" />
        </div>
      </Scene>

      {/* Transition */}
      <div className="relative h-[50vh] bg-gradient-to-b from-boat-deep via-boat-storm to-boat-deep">
        <Rain intensity="heavy" />
        <Lightning frequency={4} />
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 4: THE RESCUE                  */}
      {/* ═══════════════════════════════════════ */}
      <Scene
        id="chapter-4"
        scrollHeight="450vh"
        layers={[
          {
            src: "/images/ch4-rescue.jpg",
            speed: 0.08,
            overlay:
              "linear-gradient(to bottom, rgba(5,8,16,0.2), rgba(5,8,16,0.3), rgba(5,8,16,0.4))",
          },
          {
            speed: 0.2,
            children: (
              <AmbientGlow color="rgba(196, 146, 58, 0.2)" position="top" />
            ),
          },
          {
            speed: 0.3,
            children: (
              <>
                <Rain intensity="medium" />
                <Lightning frequency={10} />
              </>
            ),
          },
        ]}
      >
        <div className="flex flex-col items-center gap-16 px-6 py-20">
          <ChapterTitle chapter={4} title="The Rescue" />

          <NarrativeText mode="paragraph" size="md" delay={0.2}>
            The smaller vessel appeared in a flash of lightning, impossibly close to the reef.
            A wooden-hulled boat, perhaps forty feet, listing hard to starboard. Elias could see
            figures on deck, clinging to whatever they could hold.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            He angled the beam. A blade of amber cutting through absolute darkness.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            The great lens rotated, and Elias manually overrode the mechanism, locking the beam
            toward the reef passage. The only safe channel. If they could see it. If they could
            steer for it. If they had anything left to steer with.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            For twenty minutes that lasted twenty years, the boat fought toward the light. It
            disappeared behind walls of black water, reappeared, disappeared again. Each time it
            surfaced, it was closer. Each time, Elias held his breath until his chest burned.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            The boat cleared the reef. The light had held.
          </NarrativeText>

          <Waves color="rgba(10, 14, 23, 0.85)" />
        </div>
      </Scene>

      {/* Transition */}
      <div className="relative h-[50vh] bg-gradient-to-b from-boat-deep via-boat-ocean to-boat-deep">
        <Rain intensity="light" />
        <Fog layers={2} />
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* CHAPTER 5: THE DAWN                    */}
      {/* ═══════════════════════════════════════ */}
      <Scene
        id="chapter-5"
        scrollHeight="400vh"
        layers={[
          {
            src: "/images/ch5-dawn.jpg",
            speed: 0.1,
            overlay:
              "linear-gradient(to bottom, rgba(5,8,16,0.3), rgba(5,8,16,0.2), rgba(5,8,16,0.5))",
          },
          {
            speed: 0.2,
            children: (
              <AmbientGlow color="rgba(196, 146, 58, 0.2)" position="bottom" />
            ),
          },
        ]}
      >
        <div className="flex flex-col items-center gap-16 px-6 py-20">
          <ChapterTitle chapter={5} title="The Dawn" />

          <NarrativeText mode="paragraph" size="md" delay={0.2}>
            The wind died as suddenly as it had risen. In the silence that followed, Elias could
            hear the building creak and settle, like a ship finding its keel after heavy seas. Rain
            still fell, but softly now, almost tenderly.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.3}>
            The eastern sky cracked open. A thin line of amber, then gold, then a white so pure it
            hurt to look at. The sea, which hours before had been a thing of fury, lay exhausted
            beneath the growing light, its surface rising and falling in long, slow breaths.
          </NarrativeText>

          <NarrativeText mode="word" size="lg" delay={0.2}>
            In the harbor below, the boat rested safely at anchor. Figures moved on deck.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="md" delay={0.4}>
            Elias extinguished the lamp. He descended the iron staircase, each step a mirror of the
            ten thousand ascents before. At the base of the tower, he opened the door and stood in
            the morning air, tasting salt and rain and something else. Something like gratitude.
          </NarrativeText>

          <NarrativeText mode="paragraph" size="lg" delay={0.5}>
            Tomorrow night, he would climb the stairs again.
          </NarrativeText>

          <Particles count={25} />
          <Fog layers={2} />
        </div>
      </Scene>

      {/* ═══════════════════════════════════════ */}
      {/* EPILOGUE / END                         */}
      {/* ═══════════════════════════════════════ */}
      <footer className="relative h-screen flex flex-col items-center justify-center bg-boat-deep px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-px bg-boat-amber/40" />
          <p
            className="text-sm tracking-[0.3em] uppercase text-boat-pale/40 font-sans"
          >
            The Lighthouse Keeper
          </p>
          <p
            className="text-xs text-boat-mist/40 font-sans text-center max-w-sm leading-relaxed"
          >
            An interactive graphic novel experience. Scroll-driven storytelling
            with parallax illustration, atmospheric effects, and ambient sound design.
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
