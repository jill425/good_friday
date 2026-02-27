"use client"

import { useEffect, useRef } from "react"

export interface CrownSceneProps {
  chapter: 1 | 2 | 3
  scrollProgress: number
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Deterministic pseudo-random — no Math.random
function hash(n: number): number {
  return ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1
}

export function CrownScene({ chapter, scrollProgress }: CrownSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ chapter, scrollProgress })

  useEffect(() => {
    stateRef.current.chapter = chapter
    stateRef.current.scrollProgress = scrollProgress
  }, [chapter, scrollProgress])

  useEffect(() => {
    if (!containerRef.current) return

    let animationId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any, scene: any, camera: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allMeshes: any[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainLight: any, fillLight: any, spotLight: any

    const init = async () => {
      const THREE = await import("three")

      // ── Renderer ──────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      containerRef.current!.appendChild(renderer.domElement)

      // ── Scene & Camera ─────────────────────────────────────────
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0.4, 4.8)
      camera.lookAt(0, 0, 0)

      // ── Lights ─────────────────────────────────────────────────
      // Main point light — colour & intensity lerped by chapter
      mainLight = new THREE.PointLight(0xff3300, 0.4, 20)
      mainLight.position.set(1.5, 3.5, 3)
      scene.add(mainLight)

      // Soft fill
      fillLight = new THREE.AmbientLight(0x110005, 0.4)
      scene.add(fillLight)

      // Rim from behind
      const rimLight = new THREE.DirectionalLight(0x221100, 0.25)
      rimLight.position.set(-3, 1, -3)
      scene.add(rimLight)

      // Spot from above for dramatic spike highlights
      spotLight = new THREE.SpotLight(0xffd000, 0.0, 18, Math.PI / 5, 0.6, 1.5)
      spotLight.position.set(0, 6, 1.5)
      spotLight.target.position.set(0, 0, 0)
      scene.add(spotLight)
      scene.add(spotLight.target)

      // ── Materials ─────────────────────────────────────────────
      const thornMat = new THREE.MeshStandardMaterial({
        color: 0x1e0e05,
        roughness: 0.95,
        metalness: 0.04,
      })

      const goldMat = new THREE.MeshPhysicalMaterial({
        color: 0xc89b1a,
        metalness: 0.93,
        roughness: 0.36,
        clearcoat: 0.9,
        clearcoatRoughness: 0.18,
      })

      // ── THORN TUBES ───────────────────────────────────────────
      // 4 CatmullRom tubes that wind around the crown base,
      // varying in height to create a layered interweaving look.
      for (let i = 0; i < 4; i++) {
        const points = []
        const numCtrl = 16
        // Stagger the start angle so tubes don't perfectly overlap
        const angleOffset = (i / 4) * Math.PI * 2 + hash(i * 17) * 0.4
        // Each tube has its own height "lane" to suggest weaving
        const yBias = -0.3 + i * 0.12

        for (let j = 0; j < numCtrl; j++) {
          const t = j / numCtrl
          const angle = t * Math.PI * 2 + angleOffset
          const r = 1.18 + (hash(i * 100 + j) - 0.5) * 0.11
          const y = yBias + (hash(i * 50 + j * 7 + 3) - 0.5) * 0.38
          points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r))
        }

        const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5)
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.036, 7, true)
        const tube = new THREE.Mesh(tubeGeo, thornMat)
        scene.add(tube)
        allMeshes.push(tube)
      }

      // ── BASE BAND (torus ring, separates thorns from gold) ────
      const baseGeo = new THREE.TorusGeometry(1.2, 0.075, 10, 36)
      const baseMesh = new THREE.Mesh(baseGeo, thornMat)
      baseMesh.rotation.x = Math.PI / 2
      baseMesh.position.y = 0.02
      scene.add(baseMesh)
      allMeshes.push(baseMesh)

      // ── GOLD FLAME SPIKES ─────────────────────────────────────
      // Heights follow a rhythmic pattern: tall–short–taller–short–tallest–…
      const spikeHeights = [0.82, 0.54, 0.96, 0.56, 1.22, 0.56, 0.96, 0.54, 0.82]
      const numSpikes = spikeHeights.length

      for (let i = 0; i < numSpikes; i++) {
        const h = spikeHeights[i]
        const bw = 0.095   // base half-width
        const mw = 0.12    // mid belly half-width

        // Flame / leaf profile in the XY plane, tip at top
        const shape = new THREE.Shape()
        shape.moveTo(0, h)
        shape.bezierCurveTo(-mw, h * 0.66, -bw, h * 0.30, -bw * 0.65, 0)
        shape.lineTo(bw * 0.65, 0)
        shape.bezierCurveTo(bw, h * 0.30, mw, h * 0.66, 0, h)

        const depth = 0.058
        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelThickness: 0.013,
          bevelSize: 0.013,
          bevelSegments: 3,
        })
        // Centre the extrusion depth so the spike sits symmetrically on the ring
        extrudeGeo.translate(0, 0, -depth / 2)

        const spike = new THREE.Mesh(extrudeGeo, goldMat)

        const angle = (i / numSpikes) * Math.PI * 2
        spike.position.set(Math.cos(angle) * 1.2, 0.02, Math.sin(angle) * 1.2)
        // Rotate so the flat face is tangent to the ring (faces outward)
        spike.rotation.y = Math.PI / 2 - angle

        scene.add(spike)
        allMeshes.push(spike)
      }

      // ── Store rest / scatter data ──────────────────────────────
      allMeshes.forEach((mesh, i) => {
        mesh.userData.restPos = mesh.position.clone()
        mesh.userData.restRot = {
          x: mesh.rotation.x,
          y: mesh.rotation.y,
          z: mesh.rotation.z,
        }

        // Scatter using golden angle for even distribution
        const ga = i * 137.508 * (Math.PI / 180)
        const radius = 2.6 + (i % 3) * 0.75
        mesh.userData.scatterPos = {
          x: Math.cos(ga) * radius,
          y: (Math.sin(ga * 0.7) * 2.2) - 0.5,
          z: Math.sin(ga) * radius * 0.55,
        }
        mesh.userData.scatterRotSpeed = {
          x: (hash(i * 0.37) - 0.5) * 0.018,
          y: (hash(i * 0.61) - 0.5) * 0.022,
          z: (hash(i * 0.91) - 0.5) * 0.016,
        }
      })

      // ── Resize ─────────────────────────────────────────────────
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(containerRef.current as any)._resize = handleResize

      // ── Animation loop ─────────────────────────────────────────
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        const { chapter: ch, scrollProgress: sp } = stateRef.current

        // — Light transitions —
        if (ch === 1) {
          mainLight.color.setHex(0xff3300)
          mainLight.intensity += (0.38 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.08 - fillLight.intensity) * 0.05
          spotLight.intensity += (0.0 - spotLight.intensity) * 0.05
        } else if (ch === 2) {
          mainLight.color.setHex(0xffaa44)
          mainLight.intensity += (0.65 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.2 - fillLight.intensity) * 0.05
          spotLight.intensity += (0.25 - spotLight.intensity) * 0.05
        } else {
          mainLight.color.setHex(0xffd700)
          mainLight.intensity += (1.1 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.38 - fillLight.intensity) * 0.05
          spotLight.intensity += (0.6 - spotLight.intensity) * 0.05
        }

        // — Mesh animation —
        allMeshes.forEach((mesh) => {
          const rest = mesh.userData.restPos
          const scatter = mesh.userData.scatterPos
          const restRot = mesh.userData.restRot
          const rotSpeed = mesh.userData.scatterRotSpeed

          if (ch === 1) {
            // Scatter: drift to scattered positions, each piece self-rotates
            mesh.position.x += (scatter.x - mesh.position.x) * 0.03
            mesh.position.y += (scatter.y - mesh.position.y) * 0.03
            mesh.position.z += (scatter.z - mesh.position.z) * 0.03
            mesh.rotation.x += rotSpeed.x
            mesh.rotation.y += rotSpeed.y
            mesh.rotation.z += rotSpeed.z
          } else if (ch === 2) {
            // Gather: eased interpolation scatter → rest driven by scrollProgress
            const t = easeInOutCubic(Math.max(0, Math.min(1, sp)))
            const tx = scatter.x + (rest.x - scatter.x) * t
            const ty = scatter.y + (rest.y - scatter.y) * t
            const tz = scatter.z + (rest.z - scatter.z) * t
            mesh.position.x += (tx - mesh.position.x) * 0.08
            mesh.position.y += (ty - mesh.position.y) * 0.08
            mesh.position.z += (tz - mesh.position.z) * 0.08
            mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.08 * t
            mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.08 * t
            mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.08 * t
          } else {
            // Crown: snap to rest, whole scene rotates slowly
            mesh.position.x += (rest.x - mesh.position.x) * 0.05
            mesh.position.y += (rest.y - mesh.position.y) * 0.05
            mesh.position.z += (rest.z - mesh.position.z) * 0.05
            mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.05
            mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.05
            mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.05
          }
        })

        // Whole-scene slow rotation in chapter 3
        if (ch === 3) {
          scene.rotation.y += 0.003
        } else {
          scene.rotation.y *= 0.97
        }

        renderer.render(scene, camera)
      }
      animate()
    }

    init()

    return () => {
      cancelAnimationFrame(animationId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("resize", (containerRef.current as any)?._resize ?? (() => {}))
      if (renderer) {
        renderer.dispose()
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
      allMeshes.forEach((m) => {
        m.geometry.dispose()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (Array.isArray(m.material)) m.material.forEach((mat: any) => mat.dispose())
        else m.material.dispose()
      })
      allMeshes = []
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />
}
