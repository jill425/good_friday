"use client"

import { useEffect, useRef } from "react"

export interface CrownSceneProps {
  chapter: 1 | 2 | 3
  scrollProgress: number
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function CrownScene({ chapter, scrollProgress }: CrownSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ chapter, scrollProgress })

  // Keep stateRef in sync without triggering animation loop issues
  useEffect(() => {
    stateRef.current.chapter = chapter
    stateRef.current.scrollProgress = scrollProgress
  }, [chapter, scrollProgress])

  useEffect(() => {
    if (!containerRef.current) return

    let animationId: number
    let renderer: import("three").WebGLRenderer
    let scene: import("three").Scene
    let camera: import("three").PerspectiveCamera
    let meshes: import("three").Mesh[] = []
    let mainLight: import("three").PointLight
    let fillLight: import("three").AmbientLight

    const init = async () => {
      const THREE = await import("three")

      // ── Renderer ──────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      containerRef.current!.appendChild(renderer.domElement)

      // ── Scene & Camera ─────────────────────────────────────────
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 4.5)

      // ── Lights ─────────────────────────────────────────────────
      mainLight = new THREE.PointLight(0xff3300, 0.4, 20)
      mainLight.position.set(2, 3, 4)
      scene.add(mainLight)

      fillLight = new THREE.AmbientLight(0x111111, 0.3)
      scene.add(fillLight)

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.2)
      rimLight.position.set(-3, -1, -2)
      scene.add(rimLight)

      // ── Crown Geometry ─────────────────────────────────────────
      // Materials
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xc4923a,
        metalness: 0.9,
        roughness: 0.2,
      })
      const spikeMat = new THREE.MeshStandardMaterial({
        color: 0xd4a845,
        metalness: 0.85,
        roughness: 0.25,
      })
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        metalness: 0.1,
        roughness: 0.05,
        emissive: 0x440000,
        emissiveIntensity: 0.5,
      })

      // 1 — torus (crown base ring)
      const torusGeo = new THREE.TorusGeometry(1.2, 0.12, 8, 24)
      const torusMesh = new THREE.Mesh(torusGeo, ringMat)
      scene.add(torusMesh)
      meshes.push(torusMesh)

      // 7 — spike cones along the ring
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2
        const coneGeo = new THREE.ConeGeometry(0.1, 0.7, 6)
        const coneMesh = new THREE.Mesh(coneGeo, spikeMat)

        // Rest position: on the ring, pointing up
        const rx = Math.cos(angle) * 1.2
        const rz = Math.sin(angle) * 1.2
        coneMesh.position.set(rx, 0.35, rz)
        coneMesh.rotation.z = -angle + Math.PI / 2
        // We store rest rotation separately; handled via userData
        coneMesh.userData.restRotation = { x: 0, y: 0, z: -angle + Math.PI / 2 }

        scene.add(coneMesh)
        meshes.push(coneMesh)
      }

      // 3 — octahedron gems at spikes 1, 3, 5
      const gemIndices = [1, 3, 5]
      for (let gi = 0; gi < 3; gi++) {
        const spikeIdx = gemIndices[gi]
        const angle = (spikeIdx / 7) * Math.PI * 2
        const gemGeo = new THREE.OctahedronGeometry(0.12, 0)
        const gemMesh = new THREE.Mesh(gemGeo, gemMat)

        const rx = Math.cos(angle) * 1.2
        const rz = Math.sin(angle) * 1.2
        gemMesh.position.set(rx, 0.75, rz)

        scene.add(gemMesh)
        meshes.push(gemMesh)
      }

      // ── Store rest positions ───────────────────────────────────
      // Save rest positions once geometry is placed
      meshes.forEach((mesh, i) => {
        mesh.userData.restPos = mesh.position.clone()
        mesh.userData.restRot = mesh.rotation.clone()

        // Scatter positions using golden angle (deterministic)
        const goldenAngle = i * 137.508 * (Math.PI / 180)
        const radius = 2.5 + (i % 3) * 0.8
        const sx = Math.cos(goldenAngle) * radius
        const sy = (Math.sin(goldenAngle * 0.7) * 2) - 1
        const sz = Math.sin(goldenAngle) * radius * 0.6
        mesh.userData.scatterPos = { x: sx, y: sy, z: sz }
        mesh.userData.scatterRotSpeed = {
          x: ((i * 0.37) % 1) * 0.02 - 0.01,
          y: ((i * 0.61) % 1) * 0.02 - 0.01,
          z: ((i * 0.91) % 1) * 0.02 - 0.01,
        }
      })

      // ── Resize handler ─────────────────────────────────────────
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      // ── Animation loop ─────────────────────────────────────────
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        const { chapter: ch, scrollProgress: sp } = stateRef.current

        // Light transitions
        if (ch === 1) {
          mainLight.color.setHex(0xff3300)
          mainLight.intensity += (0.4 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.1 - fillLight.intensity) * 0.05
        } else if (ch === 2) {
          mainLight.color.setHex(0xffaa44)
          mainLight.intensity += (0.6 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.2 - fillLight.intensity) * 0.05
        } else {
          mainLight.color.setHex(0xffd700)
          mainLight.intensity += (1.0 - mainLight.intensity) * 0.05
          fillLight.intensity += (0.4 - fillLight.intensity) * 0.05
        }

        meshes.forEach((mesh, i) => {
          const rest = mesh.userData.restPos
          const scatter = mesh.userData.scatterPos
          const rotSpeed = mesh.userData.scatterRotSpeed

          if (ch === 1) {
            // Scatter: lerp to scatter positions, each mesh self-rotates
            mesh.position.x += (scatter.x - mesh.position.x) * 0.03
            mesh.position.y += (scatter.y - mesh.position.y) * 0.03
            mesh.position.z += (scatter.z - mesh.position.z) * 0.03
            mesh.rotation.x += rotSpeed.x
            mesh.rotation.y += rotSpeed.y
            mesh.rotation.z += rotSpeed.z
          } else if (ch === 2) {
            // Gather: interpolate between scatter and rest based on eased scrollProgress
            const t = easeInOutCubic(Math.max(0, Math.min(1, sp)))
            const tx = scatter.x + (rest.x - scatter.x) * t
            const ty = scatter.y + (rest.y - scatter.y) * t
            const tz = scatter.z + (rest.z - scatter.z) * t
            mesh.position.x += (tx - mesh.position.x) * 0.08
            mesh.position.y += (ty - mesh.position.y) * 0.08
            mesh.position.z += (tz - mesh.position.z) * 0.08

            const restRot = mesh.userData.restRot
            mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.08 * t
            mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.08 * t
            mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.08 * t
          } else {
            // Crown: snap to rest, whole scene rotates
            mesh.position.x += (rest.x - mesh.position.x) * 0.05
            mesh.position.y += (rest.y - mesh.position.y) * 0.05
            mesh.position.z += (rest.z - mesh.position.z) * 0.05

            const restRot = mesh.userData.restRot
            mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.05
            mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.05
            mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.05
          }
        })

        // Whole-scene y-rotation in chapter 3
        if (ch === 3) {
          scene.rotation.y += 0.003
        } else {
          scene.rotation.y *= 0.98 // gentle slow-down
        }

        renderer.render(scene, camera)
      }
      animate()

      // Store resize handler for cleanup
      ;(containerRef.current as HTMLDivElement & { _resize?: () => void })._resize = handleResize
    }

    init()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", (containerRef.current as HTMLDivElement & { _resize?: () => void })?._resize ?? (() => {}))
      if (renderer) {
        renderer.dispose()
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
      meshes.forEach((m) => {
        m.geometry.dispose()
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose())
        } else {
          (m.material as import("three").Material).dispose()
        }
      })
      meshes = []
    }
  }, []) // Only runs once; state is synced via stateRef

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />
}
