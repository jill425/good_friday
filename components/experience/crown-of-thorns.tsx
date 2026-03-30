"use client"

import dynamic from "next/dynamic"
import { motion } from "motion/react"
import { NarrativeText } from "./narrative-text"
import { Particles, AmbientGlow } from "./atmospheric-effects"
import { ProgressBar } from "./progress-bar"
import { SoundController } from "./sound-controller"

const CrownPhoto = dynamic(
    () => import("@/components/experience/crown-photo").then(m => ({ default: m.CrownPhoto })),
    { ssr: false }
)

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
                    基督受難晚會 2026
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-xs tracking-[0.2em] text-boat-pale/40 font-sans"
                >
                    台北旌旗教會
                </motion.span>
            </header>

            {/* ── 標題 ── */}
            <motion.section
                className="relative z-20 min-h-screen flex justify-center items-center px-6 pointer-events-none"
                style={{ scrollSnapAlign: "center" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <img
                    src="/images/under_crown_title.png"
                    alt="冠冕之下 — 基督受難晚會 2026"
                    className="w-full max-w-lg"
                    style={{ filter: "invert(1) sepia(0.2) brightness(0.5)" }}
                />
            </motion.section>

            {/* ── 敘事內容 ──────────────────────────────────────────── */}
            <section className="relative z-20 pointer-events-none">
                <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none" style={{ marginBottom: "-100vh" }}>
                    <Particles count={20} />
                    <AmbientGlow color="rgba(196, 146, 58, 0.12)" position="center" />
                </div>

                {/* ── 經文 ── */}
                <div className="relative flex flex-col items-center max-w-xl mx-auto pointer-events-auto">

                    {/* ── 經文：馬太福音 27:28-29 ── */}
                    <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-12" style={{ scrollSnapAlign: "center" }}>

                        <NarrativeText mode="line" size="md" delay={0.2}>
                            {"他們剝下耶穌的衣服\n給祂披上一件朱紅色長袍\n用荊棘編成冠冕 戴在祂頭上\n又拿一根葦稈放在祂右手裡\n跪在祂跟前戲弄祂 說 \n「猶太人的王萬歲！」"}
                        </NarrativeText>
                        <NarrativeText mode="line" size="sm" align="right" color="text-boat-pale/60" delay={0.2} className="mt-4 mb-8 !max-w-fit !ml-auto !mr-0">
                            {"馬太福音27 28-29"}
                        </NarrativeText>
                    </div>

                    {/* ── 詩意段落 ── */}
                    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <NarrativeText mode="line" size="lg" color="text-boat-amber" delay={0.1}>
                            {"冠冕\n戴上時並不榮耀"}
                        </NarrativeText>
                    </div>
                    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <NarrativeText mode="line" size="md" delay={0.1}>
                            {"那一夜 在無人理解的黑暗裡\n祂放下權柄\n承擔不屬於祂的重量"}
                        </NarrativeText>
                    </div>

                    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <NarrativeText mode="line" size="md" delay={0.1}>
                            {"那一個清晨 復活的曙光劃破沈默\n同一頂冠冕\n在光中顯出不同的意義"}
                        </NarrativeText>
                    </div>

                    <div className="min-h-screen flex items-center justify-center px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <NarrativeText mode="line" size="md" delay={0.1}>
                            {"有些放下很痛 有些順服 需要代價"}
                        </NarrativeText>
                    </div>

                    {/* ── 經文：啟示錄 19:12-13 ── */}
                    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ scrollSnapAlign: "center" }}>

                        <NarrativeText mode="line" size="md" delay={0.2}>
                            {"祂憑公義審判和爭戰\n祂雙目如炬 頭上戴了許多冠冕\n身上寫著一個只有祂自己才明白的名字\n祂穿著被血浸透的衣服\n祂的名字是「上帝的道」"}
                        </NarrativeText>
                        <NarrativeText mode="line" size="sm" align="right" color="text-boat-pale/60" delay={0.2} className="mt-4 mb-8 !max-w-fit !ml-auto !mr-0">
                            {"啟示錄19 12-13"}
                        </NarrativeText>
                    </div>

                    {/* ── 分隔線 + 邀請文字 ── */}
                    <div className="min-h-screen flex flex-col items-center justify-center gap-12 px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.8 }}
                            className="w-12 h-px bg-boat-amber/60"
                        />

                        <motion.p
                            {...fadeUp}
                            transition={{ duration: 1 }}
                            className="text-center text-boat-cream/90 leading-loose tracking-wide"
                            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.15rem, 3vw, 1.5rem)" }}
                        >
                            4 / 3（五）、 4 / 5（日）<br />
                            邀請你走進這段時刻<br /><br />

                            <span className="text-boat-amber">
                                在沉重與榮耀之間<br />
                                會重新看見
                                那份為你而來的愛
                            </span>
                        </motion.p>
                    </div>

                    {/* ── 活動資訊卡 ── */}
                    <div className="min-h-screen flex flex-col items-center justify-center gap-12 px-6 py-8" style={{ scrollSnapAlign: "center" }}>
                        <motion.div
                            {...fadeUp}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="w-full flex flex-col sm:flex-row gap-4 max-w-4xl"
                        >
                            {/* 基督受難晚會 */}
                            <div className="flex-1 border border-boat-amber/30 rounded px-8 py-7 flex flex-col gap-4 bg-boat-deep/60 backdrop-blur-sm">
                                <p className="text-base tracking-[0.3em] uppercase text-boat-amber font-sans">
                                    基督受難晚會
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
                            <div className="flex-1 border border-boat-amber/30 rounded px-8 py-7 flex flex-col gap-4 bg-boat-deep/60 backdrop-blur-sm">
                                <p className="text-base tracking-[0.3em] uppercase text-boat-amber font-sans">
                                    復活主日
                                </p>
                                <p className="text-3xl font-serif text-boat-cream font-medium">
                                    04.05 <span className="text-base text-boat-pale/70 font-sans font-normal">（日）</span>
                                </p>
                                <div className="w-8 h-px bg-boat-amber/40" />
                                <div className="flex flex-col gap-1 text-base text-boat-pale/80 font-sans">
                                    <span>09:00 、 11:00</span>
                                    <span>台北旌旗教會　二樓主堂</span>
                                </div>
                            </div>

                        </motion.div>
                        {/*注意事項*/}
                        <div>
                            <NarrativeText mode="line" size="md" >
                                {"邀請大家不只預備心 也一同預備服飾\n以慎重 整齊的態度參與聚會"}
                            </NarrativeText>
                        </div>
                        {/* ── 讀經計劃 ── */}
                        <motion.a
                            href="https://www.bible.com/zh_TW/reading-plans/69364"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...fadeUp}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="group flex flex-col items-center gap-3"
                        >
                            <span className="font-serif text-2xl text-boat-cream leading-snug underline underline-offset-4 decoration-boat-cream/30 group-hover:decoration-boat-cream/80 transition-all duration-300">
                                冠冕之下 讀經計劃
                            </span>

                            <div className="flex items-center gap-2">

                                <span className="text-xs text-boat-pale/50 font-sans leading-relaxed group-hover:text-boat-pale/80 transition-colors duration-300">
                                    邀請你使用 YouVersion 參與讀經計劃
                                </span>
                                <img
                                    src="/images/bible.png"
                                    alt="YouVersion"
                                    className="w-5 h-5 shrink-0"
                                />
                                {/* <ExternalLink className="w-3 h-3 text-boat-pale/40 group-hover:text-boat-pale/80 transition-colors duration-300" /> */}
                            </div>
                        </motion.a>
                    </div>
                </div>
            </section >
        </div >
    )
}
