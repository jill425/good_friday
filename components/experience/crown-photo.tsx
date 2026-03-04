"use client"

// Static top-level imports — possible because this module is loaded with
// next/dynamic({ ssr: false }), so it never runs on the server.
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

// Start fetching the GLB the instant this module is parsed — before the
// component even mounts. The ArrayBuffer is injected into THREE.Cache so
// GLTFLoader never triggers a second network request.
const MODEL_URL = "/models/crown.glb"
THREE.Cache.enabled = true
const _glbBufferPromise = fetch(MODEL_URL)
  .then(r => r.arrayBuffer())
  .then(buf => { THREE.Cache.add(MODEL_URL, buf) })
  .catch(() => { /* fall back to a normal network fetch */ })

// Pre-warm the Draco decoder (downloads the WASM now, in parallel with everything
// else) so it's ready the moment GLTFLoader needs it.
const _dracoPrewarm = new DRACOLoader()
_dracoPrewarm.setDecoderPath("/draco/gltf/")
_dracoPrewarm.preload()

export function CrownPhoto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const onScrollRef = useRef<(() => void) | null>(null)
  const onResizeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let animId = 0
    let renderer: THREE.WebGLRenderer
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let crown: THREE.Object3D
    let targetRotX = Math.PI * 1.25
    let currentRotX = Math.PI * 1.25

    const init = async () => {
      // Wait for the pre-fetched GLB to be in THREE.Cache (usually already done
      // by the time the user's browser finishes parsing the page JS).
      await _glbBufferPromise

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

      // ── Load GLB (served from THREE.Cache — zero network cost) ─
      const loader = new GLTFLoader()
      loader.setDRACOLoader(_dracoPrewarm)
      const gltf = await loader.loadAsync(MODEL_URL)
      crown = gltf.scene
      setIsLoaded(true)

      const box = new THREE.Box3().setFromObject(crown)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      crown.position.sub(center)
      crown.scale.setScalar(2.8 / Math.max(size.x, size.y, size.z))
      scene.add(crown)

      // ── Scroll → rotation ──────────────────────────────────────
      // maxScroll is captured once here and refreshed only on genuine resize.
      // Never recalculate inside onScroll — on mobile the URL bar collapsing
      // increases clientHeight mid-scroll, shrinking the denominator and making
      // progress jump, which snaps the crown to a wrong angle.
      let maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight

      const onScroll = () => {
        const raw = maxScroll > 0 ? window.scrollY / maxScroll : 0
        const progress = Math.min(1, Math.max(0, raw))
        targetRotX = Math.PI * 1.25 * (1 - progress)
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      onScrollRef.current = onScroll

      // Sync both angles with the real scroll position BEFORE fade-in.
      // Without this, if the user has already scrolled while the model was
      // loading, the animation loop chases the correct angle as the crown fades
      // in — producing the sudden zoom / jump the user sees.
      onScroll()
      currentRotX = targetRotX

      // Fade the canvas in only after the rotation is already correct.
      setIsLoaded(true)

      // ── Resize ─────────────────────────────────────────────────
      // Only respond to width changes (orientation / desktop window resize).
      // Ignores height-only changes caused by the mobile URL bar collapsing,
      // which previously triggered renderer.setSize and made the crown jump.
      let stableWidth = window.innerWidth
      const onResize = () => {
        if (window.innerWidth === stableWidth) return
        stableWidth = window.innerWidth
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight
      }
      window.addEventListener("resize", onResize)
      onResizeRef.current = onResize

      // ── Animation loop ─────────────────────────────────────────
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (crown) {
          currentRotX += (targetRotX - currentRotX) * 0.05
          crown.rotation.x = currentRotX
          crown.rotation.y = Math.sin(Date.now() * 0.0003) * 0.06
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    init().catch(err => {
      console.warn("[CrownPhoto] Failed to initialise 3D scene:", err)
    })

    return () => {
      cancelAnimationFrame(animId)
      if (onScrollRef.current) window.removeEventListener("scroll", onScrollRef.current)
      if (onResizeRef.current) window.removeEventListener("resize", onResizeRef.current)
      if (crown) {
        crown.traverse((obj) => {
          const mesh = obj as THREE.Mesh
          if (mesh.isMesh) {
            mesh.geometry.dispose()
            const mat = mesh.material
            if (Array.isArray(mat)) mat.forEach(m => m.dispose())
            else mat.dispose()
          }
        })
      }
      if (renderer) {
        renderer.dispose()
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
