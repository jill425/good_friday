"use client"

import { useEffect, useRef } from "react"

export function CrownPhoto() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let animId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any, scene: any, camera: any, crown: any
    let targetRotX = Math.PI * 1.25
    let currentRotX = Math.PI * 1.25

    const init = async () => {
      const THREE = await import("three")
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js")

      // ── Renderer ──────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.4
      renderer.shadowMap.enabled = true
      containerRef.current!.appendChild(renderer.domElement)

      // ── Scene & Camera ─────────────────────────────────────────
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 5)

      // ── Lights ─────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xfff4e0, 0.6))

      const keyLight = new THREE.DirectionalLight(0xffd080, 2.5)
      keyLight.position.set(3, 5, 4)
      keyLight.castShadow = true
      scene.add(keyLight)

      const fillLight = new THREE.PointLight(0x88aaff, 1.2, 20)
      fillLight.position.set(-4, 0, 3)
      scene.add(fillLight)

      const rimLight = new THREE.DirectionalLight(0xffcc55, 1.0)
      rimLight.position.set(-2, -4, -3)
      scene.add(rimLight)

      const topLight = new THREE.PointLight(0xffffff, 0.8, 15)
      topLight.position.set(0, 6, 2)
      scene.add(topLight)

      // ── Load GLB ───────────────────────────────────────────────
      const loader = new GLTFLoader()
      const gltf = await loader.loadAsync("/models/crown.glb")
      crown = gltf.scene

      const box = new THREE.Box3().setFromObject(crown)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      crown.position.sub(center)
      crown.scale.setScalar(2.8 / maxDim)
      scene.add(crown)

      // ── Scroll → rotation + parallax ──────────────────────────
      // Cache maxScroll here; DO NOT recalculate inside onScroll.
      // On mobile, the browser URL bar collapses when scrolling, which changes
      // window.innerHeight mid-scroll and causes maxScroll to jump → crown jolts.
      let maxScroll = document.documentElement.scrollHeight - window.innerHeight

      const onScroll = () => {
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0

        // 0% scroll = 225°, 100% scroll = 0°
        targetRotX = Math.PI * 1.25 * (1 - progress)
      }
      window.addEventListener("scroll", onScroll, { passive: true })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (containerRef.current as any)._onScroll = onScroll

      // ── Resize ─────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        // Recalculate maxScroll only on genuine resize (orientation change, etc.)
        maxScroll = document.documentElement.scrollHeight - window.innerHeight
      }
      window.addEventListener("resize", onResize)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (containerRef.current as any)._onResize = onResize

      // ── Animation loop ─────────────────────────────────────────
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (crown) {
          // Smooth follow scroll-driven rotation
          currentRotX += (targetRotX - currentRotX) * 0.05
          crown.rotation.x = currentRotX
          // Subtle Y sway to feel alive
          crown.rotation.y = Math.sin(Date.now() * 0.0003) * 0.06
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    init()

    return () => {
      cancelAnimationFrame(animId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = containerRef.current as any
      if (c?._onScroll) window.removeEventListener("scroll", c._onScroll)
      if (c?._onResize) window.removeEventListener("resize", c._onResize)
      if (renderer) {
        renderer.dispose()
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
