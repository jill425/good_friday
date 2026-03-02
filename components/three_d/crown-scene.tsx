// "use client"

// import { useEffect, useRef } from "react"

// export interface CrownSceneProps {
//   chapter: 1 | 2 | 3
//   scrollProgress: number
// }

// function easeInOutCubic(t: number): number {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
// }

// // Deterministic hash — no Math.random
// function hash(n: number): number {
//   return ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1
// }

// // Displace geometry vertices with deterministic noise
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function displaceGeo(geo: any, strength: number, seed: number) {
//   const pos = geo.attributes.position
//   for (let i = 0; i < pos.count; i++) {
//     const n = hash(i * 7.3 + seed * 13.1 + pos.getX(i) * 91)
//     const nx = (n - 0.5) * 2 * strength
//     const ny = (hash(i * 3.7 + seed * 5.3) - 0.5) * 2 * strength * 0.6
//     const nz = (hash(i * 11.1 + seed * 7.9) - 0.5) * 2 * strength
//     pos.setXYZ(i, pos.getX(i) + nx, pos.getY(i) + ny, pos.getZ(i) + nz)
//   }
//   pos.needsUpdate = true
//   geo.computeVertexNormals()
// }

// // Irregular polygon shape for glass shards (3–5 vertices)
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function createShardShape(THREE: any, seed: number, w: number, h: number) {
//   const pts = 3 + Math.floor(hash(seed * 13.7) * 3) // 3 to 5
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const shape = new THREE.Shape()
//   const verts: [number, number][] = []
//   for (let i = 0; i < pts; i++) {
//     const baseAngle = (i / pts) * Math.PI * 2
//     const jitter = (hash(seed * 7.3 + i * 4.1) - 0.5) * 0.75
//     const angle = baseAngle + jitter
//     const r = 0.5 + hash(seed * 3.1 + i * 6.7) * 0.5
//     verts.push([Math.cos(angle) * w * r, Math.sin(angle) * h * r])
//   }
//   shape.moveTo(verts[0][0], verts[0][1])
//   for (let i = 1; i < verts.length; i++) shape.lineTo(verts[i][0], verts[i][1])
//   shape.closePath()
//   return shape
// }

// export function CrownScene({ chapter, scrollProgress }: CrownSceneProps) {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const stateRef = useRef({ chapter, scrollProgress })

//   useEffect(() => {
//     stateRef.current.chapter = chapter
//     stateRef.current.scrollProgress = scrollProgress
//   }, [chapter, scrollProgress])

//   useEffect(() => {
//     if (!containerRef.current) return

//     let animationId: number
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let renderer: any, scene: any, camera: any
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let allMeshes: any[] = []
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let mainLight: any, fillLight: any, spotLight: any

//     const init = async () => {
//       const THREE = await import("three")

//       // ── Renderer ──────────────────────────────────────────────
//       renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//       renderer.setSize(window.innerWidth, window.innerHeight)
//       renderer.setClearColor(0x000000, 0)
//       renderer.toneMapping = THREE.ACESFilmicToneMapping
//       renderer.toneMappingExposure = 1.4
//       containerRef.current!.appendChild(renderer.domElement)

//       // ── Scene & Camera ─────────────────────────────────────────
//       scene = new THREE.Scene()
//       camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100)
//       camera.position.set(0, 0.4, 4.8)
//       camera.lookAt(0, 0, 0)

//       // ── Lights ─────────────────────────────────────────────────
//       // Cool blue-white for glass refraction
//       mainLight = new THREE.PointLight(0x88aaee, 0.6, 20)
//       mainLight.position.set(1.5, 3.5, 3)
//       scene.add(mainLight)

//       fillLight = new THREE.AmbientLight(0x112244, 0.5)
//       scene.add(fillLight)

//       const rimLight = new THREE.DirectionalLight(0x334488, 0.3)
//       rimLight.position.set(-3, 1, -3)
//       scene.add(rimLight)

//       spotLight = new THREE.SpotLight(0xffd000, 0.0, 18, Math.PI / 5, 0.6, 1.5)
//       spotLight.position.set(0, 6, 1.5)
//       spotLight.target.position.set(0, 0, 0)
//       scene.add(spotLight)
//       scene.add(spotLight.target)

//       // ── Glass material ─────────────────────────────────────────
//       const glassMat = new THREE.MeshPhysicalMaterial({
//         color: 0xd0e8ff,
//         transmission: 0.65,
//         ior: 1.52,
//         clearcoat: 1.0,
//         clearcoatRoughness: 0.08,
//         roughness: 0.04,
//         metalness: 0.0,
//         side: THREE.DoubleSide,
//         flatShading: true,
//       })

//       // ── Gold material for flame spikes ─────────────────────────
//       const goldMat = new THREE.MeshPhysicalMaterial({
//         color: 0xc89b1a,
//         metalness: 0.93,
//         roughness: 0.40,
//         clearcoat: 0.8,
//         clearcoatRoughness: 0.25,
//         flatShading: true,
//       })

//       // ── 20 GLASS BODY SHARDS ──────────────────────────────────
//       // Flat irregular polygons arranged in a crown ring
//       for (let i = 0; i < 20; i++) {
//         const w = 0.13 + hash(i * 5.7) * 0.17   // 0.13–0.30
//         const h = 0.18 + hash(i * 8.3) * 0.26   // 0.18–0.44
//         const shape = createShardShape(THREE, i * 31 + 7, w, h)
//         const thickness = 0.010 + hash(i * 3.1) * 0.012
//         const geo = new THREE.ExtrudeGeometry(shape, {
//           depth: thickness,
//           bevelEnabled: true,
//           bevelThickness: 0.003,
//           bevelSize: 0.003,
//           bevelSegments: 1,
//         })
//         geo.translate(0, 0, -thickness / 2)
//         displaceGeo(geo, 0.005, i * 41)

//         const mesh = new THREE.Mesh(geo, glassMat)
//         const angle = (i / 20) * Math.PI * 2 + (hash(i * 3.7) - 0.5) * 0.35
//         const r = 0.90 + (hash(i * 7.1) - 0.5) * 0.28
//         const y = (hash(i * 11.3) - 0.5) * 0.38
//         mesh.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
//         mesh.rotation.y = Math.PI / 2 - angle + (hash(i * 2.3) - 0.5) * 0.9
//         mesh.rotation.x = (hash(i * 4.1) - 0.5) * 0.55
//         scene.add(mesh)
//         allMeshes.push(mesh)
//       }

//       // ── 7 GLASS BAND SHARDS ───────────────────────────────────
//       // Flat trapezoid fragments forming the base band
//       for (let i = 0; i < 7; i++) {
//         const bw = 0.09 + hash(i * 5.1) * 0.05
//         const tw = bw * (0.55 + hash(i * 9.3) * 0.35)
//         const bh = 0.13 + hash(i * 3.3) * 0.07
//         const shape = new THREE.Shape()
//         // Irregular trapezoid with slight jitter on corners
//         const jl = (hash(i * 17.1) - 0.5) * 0.02
//         const jr = (hash(i * 19.3) - 0.5) * 0.02
//         shape.moveTo(-bw + jl, 0)
//         shape.lineTo(bw + jr, 0)
//         shape.lineTo(tw + (hash(i * 23.1) - 0.5) * 0.015, bh)
//         shape.lineTo(-tw + (hash(i * 25.3) - 0.5) * 0.015, bh)
//         shape.closePath()

//         const thickness = 0.016
//         const geo = new THREE.ExtrudeGeometry(shape, {
//           depth: thickness,
//           bevelEnabled: true,
//           bevelThickness: 0.003,
//           bevelSize: 0.003,
//           bevelSegments: 1,
//         })
//         geo.translate(0, 0, -thickness / 2)
//         displaceGeo(geo, 0.006, i * 100 + 500)

//         const band = new THREE.Mesh(geo, glassMat)
//         const midAngle = (i / 7) * Math.PI * 2 + (hash(i * 19.1) - 0.5) * 0.15
//         const r = 1.17 + (hash(i * 13.1) - 0.5) * 0.05
//         band.position.set(
//           Math.cos(midAngle) * r,
//           -0.04 + (hash(i * 7.7) - 0.5) * 0.06,
//           Math.sin(midAngle) * r
//         )
//         band.rotation.y = Math.PI / 2 - midAngle + (hash(i * 3.3) - 0.5) * 0.15
//         band.rotation.x = (hash(i * 6.1) - 0.5) * 0.12
//         scene.add(band)
//         allMeshes.push(band)
//       }

//       // ── 9 GOLD FLAME SPIKES ───────────────────────────────────
//       const spikeHeights = [0.82, 0.54, 0.96, 0.56, 1.22, 0.56, 0.96, 0.54, 0.82]
//       const numSpikes = spikeHeights.length

//       for (let i = 0; i < numSpikes; i++) {
//         const h = spikeHeights[i]
//         const bw = 0.095
//         const mw = 0.12

//         const shape = new THREE.Shape()
//         shape.moveTo(0, h)
//         shape.bezierCurveTo(-mw, h * 0.66, -bw, h * 0.30, -bw * 0.65, 0)
//         shape.lineTo(bw * 0.65, 0)
//         shape.bezierCurveTo(bw, h * 0.30, mw, h * 0.66, 0, h)

//         const depth = 0.058
//         const geo = new THREE.ExtrudeGeometry(shape, {
//           depth,
//           bevelEnabled: true,
//           bevelThickness: 0.013,
//           bevelSize: 0.013,
//           bevelSegments: 2,
//         })
//         geo.translate(0, 0, -depth / 2)
//         displaceGeo(geo, 0.006, i * 77 + 200)

//         const spike = new THREE.Mesh(geo, goldMat)
//         const angle = (i / numSpikes) * Math.PI * 2
//         spike.position.set(Math.cos(angle) * 1.2, 0.02, Math.sin(angle) * 1.2)
//         spike.rotation.y = Math.PI / 2 - angle

//         scene.add(spike)
//         allMeshes.push(spike)
//       }

//       // ── 10 GLASS CHIP SHARDS ──────────────────────────────────
//       // Small OctahedronGeometry chips with glass material
//       for (let i = 0; i < 10; i++) {
//         const size = 0.04 + hash(i * 7.3) * 0.06
//         const geo = new THREE.OctahedronGeometry(size, 0)
//         displaceGeo(geo, 0.020, i * 43 + 800)

//         const chip = new THREE.Mesh(geo, glassMat)
//         const angle = ((i + 0.5) / 10) * Math.PI * 2
//         const r = 1.05 + (hash(i * 3.1) - 0.5) * 0.18
//         chip.position.set(
//           Math.cos(angle) * r,
//           0.08 + hash(i * 5.3) * 0.32,
//           Math.sin(angle) * r
//         )
//         chip.rotation.set(
//           hash(i * 1.1) * Math.PI,
//           hash(i * 2.3) * Math.PI,
//           hash(i * 3.7) * Math.PI
//         )

//         scene.add(chip)
//         allMeshes.push(chip)
//       }

//       // ── Store rest / scatter / gather-delay data ───────────────
//       allMeshes.forEach((mesh, i) => {
//         mesh.userData.restPos = mesh.position.clone()
//         mesh.userData.restRot = {
//           x: mesh.rotation.x,
//           y: mesh.rotation.y,
//           z: mesh.rotation.z,
//         }

//         // Golden-angle scatter for even spatial distribution
//         const ga = i * 137.508 * (Math.PI / 180)
//         const radius = 2.4 + (i % 4) * 0.65
//         mesh.userData.scatterPos = {
//           x: Math.cos(ga) * radius,
//           y: (Math.sin(ga * 0.7) * 2.5) - 0.5,
//           z: Math.sin(ga) * radius * 0.55,
//         }
//         mesh.userData.scatterRotSpeed = {
//           x: (hash(i * 0.37) - 0.5) * 0.022,
//           y: (hash(i * 0.61) - 0.5) * 0.026,
//           z: (hash(i * 0.91) - 0.5) * 0.018,
//         }
//         // Stagger each piece's gather arrival (0 → 0.35 delay offset)
//         mesh.userData.gatherDelay = hash(i * 0.77) * 0.35
//       })

//       // ── Resize ─────────────────────────────────────────────────
//       const handleResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight
//         camera.updateProjectionMatrix()
//         renderer.setSize(window.innerWidth, window.innerHeight)
//       }
//       window.addEventListener("resize", handleResize)
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         ; (containerRef.current as any)._resize = handleResize

//       // ── Animation loop ─────────────────────────────────────────
//       const animate = () => {
//         animationId = requestAnimationFrame(animate)
//         const { chapter: ch, scrollProgress: sp } = stateRef.current

//         // Light transitions — cool glass blue → warm amber → brilliant white-gold
//         if (ch === 1) {
//           mainLight.color.setHex(0x88aaee)
//           mainLight.intensity += (0.55 - mainLight.intensity) * 0.05
//           fillLight.intensity += (0.12 - fillLight.intensity) * 0.05
//           spotLight.intensity += (0.0 - spotLight.intensity) * 0.05
//         } else if (ch === 2) {
//           mainLight.color.setHex(0xffd0aa)
//           mainLight.intensity += (0.8 - mainLight.intensity) * 0.05
//           fillLight.intensity += (0.28 - fillLight.intensity) * 0.05
//           spotLight.intensity += (0.35 - spotLight.intensity) * 0.05
//         } else {
//           mainLight.color.setHex(0xffffee)
//           mainLight.intensity += (1.3 - mainLight.intensity) * 0.05
//           fillLight.intensity += (0.45 - fillLight.intensity) * 0.05
//           spotLight.intensity += (0.75 - spotLight.intensity) * 0.05
//         }

//         allMeshes.forEach((mesh) => {
//           const rest = mesh.userData.restPos
//           const scatter = mesh.userData.scatterPos
//           const restRot = mesh.userData.restRot
//           const rotSpeed = mesh.userData.scatterRotSpeed
//           const delay = mesh.userData.gatherDelay

//           if (ch === 1) {
//             // Scatter: each piece drifts to its scatter position and self-rotates
//             mesh.position.x += (scatter.x - mesh.position.x) * 0.03
//             mesh.position.y += (scatter.y - mesh.position.y) * 0.03
//             mesh.position.z += (scatter.z - mesh.position.z) * 0.03
//             mesh.rotation.x += rotSpeed.x
//             mesh.rotation.y += rotSpeed.y
//             mesh.rotation.z += rotSpeed.z
//           } else if (ch === 2) {
//             // Gather: staggered eased interpolation scatter → rest
//             const adjustedSp = Math.max(0, Math.min(1, (sp - delay) / (1 - delay)))
//             const t = easeInOutCubic(adjustedSp)
//             const tx = scatter.x + (rest.x - scatter.x) * t
//             const ty = scatter.y + (rest.y - scatter.y) * t
//             const tz = scatter.z + (rest.z - scatter.z) * t
//             mesh.position.x += (tx - mesh.position.x) * 0.08
//             mesh.position.y += (ty - mesh.position.y) * 0.08
//             mesh.position.z += (tz - mesh.position.z) * 0.08
//             mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.08 * t
//             mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.08 * t
//             mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.08 * t
//           } else {
//             // Crown: snap to rest, scene rotates
//             mesh.position.x += (rest.x - mesh.position.x) * 0.05
//             mesh.position.y += (rest.y - mesh.position.y) * 0.05
//             mesh.position.z += (rest.z - mesh.position.z) * 0.05
//             mesh.rotation.x += (restRot.x - mesh.rotation.x) * 0.05
//             mesh.rotation.y += (restRot.y - mesh.rotation.y) * 0.05
//             mesh.rotation.z += (restRot.z - mesh.rotation.z) * 0.05
//           }
//         })

//         if (ch === 3) {
//           scene.rotation.y += 0.003
//         } else {
//           scene.rotation.y *= 0.97
//         }

//         renderer.render(scene, camera)
//       }
//       animate()
//     }

//     init()

//     return () => {
//       cancelAnimationFrame(animationId)
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       window.removeEventListener("resize", (containerRef.current as any)?._resize ?? (() => { }))
//       if (renderer) {
//         renderer.dispose()
//         if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
//           containerRef.current.removeChild(renderer.domElement)
//         }
//       }
//       allMeshes.forEach((m) => {
//         m.geometry.dispose()
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         if (Array.isArray(m.material)) m.material.forEach((mat: any) => mat.dispose())
//         else m.material.dispose()
//       })
//       allMeshes = []
//     }
//   }, [])

//   return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />
// }
