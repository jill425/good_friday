"use client"

import { motion } from "motion/react"
import { NarrativeText } from "./narrative-text"
import { Particles, AmbientGlow } from "./atmospheric-effects"
import { ProgressBar } from "./progress-bar"
import { SoundController } from "./sound-controller"
import { CrownPhoto } from "@/components/three_d/crown-photo"

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
}

export function CrownOfThorns() {
    return (
        <div className="relative bg-boat-deep">
            <CrownPhoto />
            <div className="grain-overlay" />
            <ProgressBar />
            <SoundController />

            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 pointer-events-none">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-xs tracking-[0.25em] uppercase text-boat-pale/50 font-sans"
                >
                    台北旌旗教會
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-xs tracking-[0.2em] text-boat-pale/40 font-sans"
                >
                    受難晚會 2026
                </motion.span>
            </header>

            {/* ── 敘事內容 ──────────────────────────────────────────── */}
            <section className="relative z-20 pointer-events-none" style={{ minHeight: "450vh" }}>
                <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
                    <Particles count={20} />
                    <AmbientGlow color="rgba(196, 146, 58, 0.12)" position="center" />
                </div>

                <div className="relative flex flex-col items-center gap-24 px-6 py-40 max-w-xl mx-auto pointer-events-auto">

                    {/* ── 詩意段落 ── */}
                    <NarrativeText mode="line" size="md" delay={0.1}>
                        {"有些冠冕\n戴上時並不榮耀。"}
                    </NarrativeText>

                    <NarrativeText mode="line" size="md" delay={0.1}>
                        {"有些路\n明知道沉重，仍然選擇走上去。"}
                    </NarrativeText>

                    <NarrativeText mode="line" size="md" delay={0.1}>
                        {"那一夜，祂放下權柄\n在無人理解的黑暗裡\n承擔本不屬於祂的重量"}
                    </NarrativeText>

                    <NarrativeText mode="line" size="md" delay={0.1}>
                        {"那一個清晨，沉默被打破\n同一頂冠冕，卻在光中顯出不同的意義。"}
                    </NarrativeText>

                    <NarrativeText mode="line" size="md" delay={0.1}>
                        {"我們都知道，有些放下很痛\n有些順服，需要代價。"}
                    </NarrativeText>

                    {/* ── 分隔線 ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.8 }}
                        className="w-12 h-px bg-boat-amber/60"
                    />

                    {/* ── 邀請文字 ── */}
                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 1 }}
                        className="text-center text-boat-cream/90 leading-loose tracking-wide"
                        style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.15rem, 3vw, 1.5rem)" }}
                    >
                        4 / 3（五）、4 / 5（日）<br />
                        我們邀請你走進這段時刻<br />
                        在沉重與榮耀之間<br />
                        <span className="text-boat-amber">
                            也許，你會重新看見——那份為你而來的愛。
                        </span>
                    </motion.p>

                    {/* ── 活動資訊卡 ── */}
                    <motion.div
                        {...fadeUp}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="w-full flex flex-col sm:flex-row gap-4"
                    >
                        {/* 受難晚會 */}
                        <div className="flex-1 border border-boat-amber/30 rounded-sm px-8 py-7 flex flex-col gap-4 bg-boat-deep/60 backdrop-blur-sm">
                            <p className="text-base tracking-[0.3em] uppercase text-boat-amber font-sans">
                                受難晚會
                            </p>
                            <p className="text-3xl font-serif text-boat-cream font-medium">
                                04.03 <span className="text-base text-boat-pale/70 font-sans font-normal">（五）</span>
                            </p>
                            <div className="w-8 h-px bg-boat-amber/40" />
                            <div className="flex flex-col gap-1 text-base text-boat-pale/80 font-sans">
                                <span>19:00 入場　19:30 開場</span>
                                <span>台北旌旗教會　二樓主堂</span>
                            </div>
                        </div>

                        {/* 復活主日 */}
                        <div className="flex-1 border border-boat-amber/30 rounded-sm px-8 py-7 flex flex-col gap-4 bg-boat-deep/60 backdrop-blur-sm">
                            <p className="text-base tracking-[0.3em] uppercase text-boat-amber font-sans">
                                復活主日
                            </p>
                            <p className="text-3xl font-serif text-boat-cream font-medium">
                                04.05 <span className="text-base text-boat-pale/70 font-sans font-normal">（日）</span>
                            </p>
                            <div className="w-8 h-px bg-boat-amber/40" />
                            <div className="flex flex-col gap-1 text-base text-boat-pale/80 font-sans">
                                <span>09:00 & 11:00</span>
                                <span>台北旌旗教會　二樓主堂</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>
        </div>
    )
}
