# 受難晚會 2026 — 台北旌旗教會

滾動式互動頁面，以 3D 荊棘冠冕、環境粒子與敘事文字，帶領使用者走進受難與復活的意義。

## 活動資訊

| 場次 | 日期 | 時間 | 地點 |
|------|------|------|------|
| 受難晚會 | 04.03（五） | 19:00 入場 / 19:30 開場 | 台北旌旗教會 二樓主堂 |
| 復活主日 | 04.05（日） | 09:00 & 11:00 | 台北旌旗教會 二樓主堂 |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19, TypeScript |
| 3D | Three.js + GLTFLoader（動態 import，SSR-safe） |
| Animation | motion/react (Framer Motion v12) |
| Styling | Tailwind CSS v4 |
| Audio | HTML Audio（`/sounds/cello-circle.m4a`，loop） |

## Project Structure

```
app/
  globals.css              CSS 變數、grain overlay
  layout.tsx               Root layout + metadata
  page.tsx                 Entry point → <CrownOfThorns />
components/three_d/
  crown-of-thorns.tsx      主頁面編排（各段落、header、活動資訊）
  crown-photo.tsx          Three.js 固定背景 canvas，scroll → 冠冕旋轉
  sound-controller.tsx     音樂自動播放 + 靜音切換按鈕
  atmospheric-effects.tsx  粒子與環境光暈
  narrative-text.tsx       逐行文字出現動畫
  progress-bar.tsx         滾動進度條
public/
  models/crown.glb         3D 荊棘冠冕模型
  sounds/cello-circle.m4a  背景音樂
  images/                  標題圖片
```

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
