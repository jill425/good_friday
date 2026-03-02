# Good Friday

A scroll-driven interactive meditation on the meaning of Good Friday — told across three chapters through 3D animation, generative audio, and progressive narrative text.

## Overview

As you scroll through the experience, a Three.js crown of thorns responds to your position in real time: shards of glass scatter and drift in Chapter 1, converge through Chapter 2, and lock into a slowly rotating diadem in Chapter 3. Ambient soundscapes generated entirely via the Web Audio API evolve with each chapter — no audio files required.

## Chapters

| # | 中文 | Theme |
|---|------|-------|
| 1 | 破碎 | Before the beginning, there was the breaking. |
| 2 | 拼湊 | The pieces did not reassemble themselves. They were called. |
| 3 | 冠冕 | Not despite the breaking. Because of it. |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5.7 |
| 3D | Three.js (dynamic import, SSR-safe) |
| Animation | motion/react (Framer Motion v12) |
| Styling | Tailwind CSS v4 |
| Audio | Web Audio API — generative synthesis |

## Architecture

```
z-0:    CrownScene        Three.js canvas, position: fixed, pointer-events: none
z-20:   <section> ×3      Scroll-driven narrative chapters
z-50:   ChapterNav        Dot navigation (right side)
        SoundController   Toggle ambient soundscape
z-70:   IntroScreen       Fullscreen title overlay
z-1000: grain-overlay     CSS noise texture
```

## Crown Scene

The crown is built from 11 Three.js meshes: 1 torus base ring, 7 cone spikes, and 3 octahedron gems. Scatter positions are derived from the golden angle (`index × 137.508°`) — fully deterministic, no `Math.random`.

| Chapter | Behaviour | Light |
|---------|-----------|-------|
| 1 破碎 | Meshes lerp to scatter positions, self-rotate | `#ff3300` dark red |
| 2 拼湊 | `easeInOutCubic` interpolation scatter → rest as you scroll | `#ffaa44` warm orange |
| 3 冠冕 | All at rest positions, `scene.rotation.y += 0.003` | `#ffd700` gold |

## Soundscapes

| Chapter | Synthesis |
|---------|-----------|
| 1 破碎 | 35 Hz rumble + detuned 220/223 Hz beat (tension) |
| 2 拼湊 | 55 Hz A + 82 Hz E fifth + 110 Hz wind tone |
| 3 冠冕 | Major triad 55A + 69C# + 82E + 110A + 440 Hz shimmer |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  globals.css              Custom CSS variables, grain overlay, crown glow
  layout.tsx               Root layout
  page.tsx                 Entry point → <StoryExperience />
components/boat/
  story-experience.tsx     Main orchestrator — chapter state, scroll tracking
  crown-scene.tsx          Three.js fixed background canvas
  intro-screen.tsx         Fullscreen intro overlay
  sound-controller.tsx     Web Audio API soundscapes
  chapter-nav.tsx          Prop-driven dot navigation
  atmospheric-effects.tsx  Particles, AmbientGlow, and visual FX
  narrative-text.tsx       Word-by-word and paragraph reveal animations
  progress-bar.tsx         Scroll progress indicator
```
