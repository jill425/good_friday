"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { ParallaxLayer } from "./parallax-layer"

interface SceneLayer {
  src?: string
  speed: number
  className?: string
  overlay?: string
  children?: React.ReactNode
}

interface SceneProps {
  id: string
  layers: SceneLayer[]
  children?: React.ReactNode
  className?: string
  scrollHeight?: string
  vignette?: boolean
}

export function Scene({
  id,
  layers,
  children,
  className = "",
  scrollHeight = "300vh",
  vignette = true,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 1, 1, 0]
  )

  return (
    <section
      id={id}
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity }} className="h-full w-full">
          {/* Background layers with parallax */}
          {layers.map((layer, i) => (
            <ParallaxLayer key={i} speed={layer.speed} className={layer.className || ""}>
              {layer.src ? (
                <div className="relative h-[120%] w-full -top-[10%]">
                  <Image
                    src={layer.src}
                    alt=""
                    fill
                    className="object-cover ink-wash"
                    sizes="100vw"
                    priority={i === 0}
                  />
                  {layer.overlay && (
                    <div
                      className="absolute inset-0"
                      style={{ background: layer.overlay }}
                    />
                  )}
                </div>
              ) : (
                layer.children
              )}
            </ParallaxLayer>
          ))}

          {/* Vignette overlay */}
          {vignette && (
            <div className="absolute inset-0 scene-vignette pointer-events-none z-10" />
          )}

          {/* Content layer (text, etc.) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
