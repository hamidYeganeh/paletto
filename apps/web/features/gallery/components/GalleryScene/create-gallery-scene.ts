import * as THREE from "three"
import type { GalleryArtwork } from "../artworks"

export type GallerySceneHandle = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  setProgress: (t: number) => void
  /** Horizontal look offset in [-1, 1] from mouse (maps to yaw) */
  setLookYaw: (normalizedX: number) => void
  setArtworks: (artworks: GalleryArtwork[]) => void
  resize: (width: number, height: number) => void
  render: () => void
  dispose: () => void
}

const WALL_COLOR = 0xffffff
/** Deep matte black floor — matches reference galleries */
const FLOOR_COLOR = 0x050505
const CEILING_COLOR = 0x080808
const FRAME_COLOR = 0x050505
const MAT_COLOR = 0xffffff
/** Outer shell — hides reverse / behind geometry */
const WALL_BACK_COLOR = 0x060606
/** Cool cove glow (slight cyan-white like the refs) */
const COVE_COLOR = 0xf2f7ff

const CAM_Y = 1.58
const HALF_WIDTH = 2.55
const PATH_SEGMENTS = 80
const PROFILE_SAMPLES = 16
const WALL_CHUNKS = 14
const ART_PROFILE_T = 0.38
const ART_Y = 1.52
const MAX_LOOK_YAW = THREE.MathUtils.degToRad(42)
const WALL_THICKNESS = 0.28

/**
 * Organic museum wall: soft cove flare at base, near-vertical mid,
 * dramatic trumpet flare into the dark ceiling — like the reference halls.
 * Returns [lateral offset from path center, height]
 */
function wallProfile(t: number): [number, number] {
  const smooth = (u: number) => u * u * (3 - 2 * u)

  // Floor cove — wall flares outward then tucks in (floating glow edge)
  if (t < 0.08) {
    const u = smooth(t / 0.08)
    const lat = HALF_WIDTH + 0.28 - u * 0.38
    const h = 0.02 + u * 0.22
    return [lat, h]
  }

  // Soft belly — slight inward curve for organic volume
  if (t < 0.48) {
    const u = (t - 0.08) / 0.4
    const belly = Math.sin(u * Math.PI) * 0.07
    return [HALF_WIDTH - 0.1 - belly, 0.24 + u * 1.72]
  }

  // Trumpet flare into ceiling — sweeping organic curve
  const u = smooth((t - 0.48) / 0.52)
  const lat = HALF_WIDTH - 0.1 + u * 1.35
  const h = 1.96 + u * 2.15
  return [lat, h]
}

function buildCenterPath(): THREE.CatmullRomCurve3 {
  const pts = [
    new THREE.Vector3(0, 0, 6),
    new THREE.Vector3(0.4, 0, 0),
    new THREE.Vector3(1.2, 0, -6),
    new THREE.Vector3(1.6, 0, -14),
    new THREE.Vector3(1.6, 0, -24),
    new THREE.Vector3(1.6, 0, -32),
    new THREE.Vector3(2.5, 0, -38),
    new THREE.Vector3(6, 0, -41),
    new THREE.Vector3(12, 0, -41.5),
    new THREE.Vector3(18, 0, -41.5),
    new THREE.Vector3(24, 0, -41.5),
    new THREE.Vector3(30, 0, -42),
    new THREE.Vector3(33, 0, -46),
    new THREE.Vector3(33.5, 0, -52),
    new THREE.Vector3(33.5, 0, -60),
    new THREE.Vector3(33.5, 0, -68),
  ]
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.15)
}

function getLateral(tangent: THREE.Vector3, target: THREE.Vector3): THREE.Vector3 {
  target.set(-tangent.z, 0, tangent.x)
  if (target.lengthSq() < 1e-8) target.set(1, 0, 0)
  return target.normalize()
}

type WallChunk = {
  mesh: THREE.Mesh
  backMesh: THREE.Mesh
  u0: number
  u1: number
}

function createWallChunkGeometry(
  path: THREE.CatmullRomCurve3,
  side: 1 | -1,
  u0: number,
  u1: number,
  latOffset = 0
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const lateral = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const center = new THREE.Vector3()
  const segs = Math.max(4, Math.ceil(PATH_SEGMENTS * (u1 - u0)))

  for (let i = 0; i <= segs; i++) {
    const u = u0 + (i / segs) * (u1 - u0)
    path.getPointAt(u, center)
    path.getTangentAt(u, tangent).normalize()
    getLateral(tangent, lateral).multiplyScalar(side)

    for (let j = 0; j <= PROFILE_SAMPLES; j++) {
      const v = j / PROFILE_SAMPLES
      const [lat, h] = wallProfile(v)
      const L = lat + latOffset
      positions.push(
        center.x + lateral.x * L,
        h,
        center.z + lateral.z * L
      )
      uvs.push(((u - u0) / Math.max(u1 - u0, 1e-6)) * 4, v)
    }
  }

  const cols = PROFILE_SAMPLES + 1
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < PROFILE_SAMPLES; j++) {
      const a = i * cols + j
      const b = a + cols
      const c = a + 1
      const d = b + 1
      if (latOffset === 0) {
        if (side === 1) indices.push(a, b, c, c, b, d)
        else indices.push(a, c, b, c, d, b)
      } else {
        if (side === 1) indices.push(a, c, b, c, d, b)
        else indices.push(a, b, c, c, b, d)
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function createWallChunks(
  path: THREE.CatmullRomCurve3,
  side: 1 | -1,
  frontMat: THREE.Material,
  backMat: THREE.Material
): WallChunk[] {
  const chunks: WallChunk[] = []
  for (let i = 0; i < WALL_CHUNKS; i++) {
    const u0 = i / WALL_CHUNKS
    const u1 = (i + 1) / WALL_CHUNKS
    const mesh = new THREE.Mesh(
      createWallChunkGeometry(path, side, u0, u1, 0),
      frontMat
    )
    const backMesh = new THREE.Mesh(
      createWallChunkGeometry(path, side, u0, u1, WALL_THICKNESS),
      backMat
    )
    chunks.push({ mesh, backMesh, u0, u1 })
  }
  return chunks
}

function createFloorGeometry(path: THREE.CatmullRomCurve3): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const lateral = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const center = new THREE.Vector3()
  const w = HALF_WIDTH + 0.55

  for (let i = 0; i <= PATH_SEGMENTS; i++) {
    const u = i / PATH_SEGMENTS
    path.getPointAt(u, center)
    path.getTangentAt(u, tangent).normalize()
    getLateral(tangent, lateral)
    positions.push(
      center.x - lateral.x * w,
      0.005,
      center.z - lateral.z * w,
      center.x + lateral.x * w,
      0.005,
      center.z + lateral.z * w
    )
    uvs.push(0, u * 10, 1, u * 10)
  }

  for (let i = 0; i < PATH_SEGMENTS; i++) {
    const a = i * 2
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function createCoveStrip(
  path: THREE.CatmullRomCurve3,
  side: 1 | -1
): THREE.Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const lateral = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const center = new THREE.Vector3()
  const segs = Math.floor(PATH_SEGMENTS * 0.85)

  for (let i = 0; i <= segs; i++) {
    const u = i / segs
    path.getPointAt(u, center)
    path.getTangentAt(u, tangent).normalize()
    getLateral(tangent, lateral).multiplyScalar(side)
    // Sit in the flared cove pocket at the wall base
    const latInner = HALF_WIDTH - 0.02
    const latOuter = HALF_WIDTH + 0.32
    const ix = center.x + lateral.x * latInner
    const iz = center.z + lateral.z * latInner
    const ox = center.x + lateral.x * latOuter
    const oz = center.z + lateral.z * latOuter
    positions.push(ix, 0.015, iz)
    positions.push(ox, 0.065, oz)
  }

  for (let i = 0; i < segs; i++) {
    const a = i * 2
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: COVE_COLOR,
      emissive: COVE_COLOR,
      emissiveIntensity: 4.2,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    })
  )
}

/** Soft light bounce from cove onto nearby walls/floor */
function createCoveLights(
  path: THREE.CatmullRomCurve3,
  side: 1 | -1,
  count: number
): THREE.Group {
  const group = new THREE.Group()
  const center = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const lateral = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    path.getPointAt(t, center)
    path.getTangentAt(t, tangent).normalize()
    getLateral(tangent, lateral).multiplyScalar(side)
    const light = new THREE.PointLight(COVE_COLOR, 1.35, 5.5, 2)
    light.position.set(
      center.x + lateral.x * (HALF_WIDTH - 0.15),
      0.28,
      center.z + lateral.z * (HALF_WIDTH - 0.15)
    )
    light.userData.pathU = t
    group.add(light)
  }
  return group
}

function createCeilingDisks(
  path: THREE.CatmullRomCurve3,
  count: number
): THREE.Group {
  const group = new THREE.Group()
  // Flat recessed disc lights like the reference ceiling
  const diskGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.028, 32)
  const diskMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf5f8ff,
    emissiveIntensity: 2.4,
    roughness: 0.55,
    metalness: 0,
  })
  const rimGeo = new THREE.TorusGeometry(0.64, 0.018, 8, 32)
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
    metalness: 0,
  })
  const center = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    path.getPointAt(t, center)
    const disk = new THREE.Mesh(diskGeo, diskMat)
    disk.position.set(center.x, 4.05, center.z)
    disk.userData.pathU = t
    group.add(disk)

    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.rotation.x = Math.PI / 2
    rim.position.set(center.x, 4.04, center.z)
    rim.userData.pathU = t
    group.add(rim)

    // Soft fill from alternate discs only (perf)
    if (i % 2 === 0) {
      const fill = new THREE.PointLight(0xffffff, 0.7, 10, 2)
      fill.position.set(center.x, 3.7, center.z)
      fill.userData.pathU = t
      group.add(fill)
    }
  }

  return group
}

function createPanelTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  // Soft warm-white base with subtle vertical panel seams
  ctx.fillStyle = "#fbfbfb"
  ctx.fillRect(0, 0, size, size)
  // Very soft vertical gradient for curved-surface feel
  const grad = ctx.createLinearGradient(0, 0, size * 0.35, 0)
  grad.addColorStop(0, "rgba(235, 235, 238, 0.35)")
  grad.addColorStop(0.5, "rgba(255, 255, 255, 0)")
  grad.addColorStop(1, "rgba(230, 232, 236, 0.25)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = "rgba(220, 220, 224, 0.55)"
  ctx.lineWidth = 1.25
  for (let i = 1; i < 5; i++) {
    const x = (i / 5) * size
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function createFrameMaterials() {
  return {
    frame: new THREE.MeshStandardMaterial({
      color: FRAME_COLOR,
      roughness: 0.55,
      metalness: 0.08,
    }),
    mat: new THREE.MeshStandardMaterial({
      color: MAT_COLOR,
      roughness: 0.92,
      metalness: 0,
    }),
    plaque: new THREE.MeshStandardMaterial({
      color: 0xf7f7f5,
      roughness: 0.88,
      metalness: 0,
    }),
  }
}

function createFrameGroup(
  artwork: GalleryArtwork,
  texture: THREE.Texture | null,
  shared: ReturnType<typeof createFrameMaterials>,
  scaleMul = 1
): THREE.Group {
  const aspect = artwork.aspect
  const scale = (artwork.scale ?? 1) * scaleMul
  const artH = 1.0 * scale
  const artW = artH * aspect
  // Wide museum matting + thin black frame (reference look)
  const matPad = 0.14
  const frameThick = 0.038
  const frameDepth = 0.045
  const outerW = artW + matPad * 2 + frameThick * 2
  const outerH = artH + matPad * 2 + frameThick * 2

  const group = new THREE.Group()

  group.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(outerW, outerH, frameDepth),
      shared.frame
    )
  )

  const matMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(artW + matPad * 2, artH + matPad * 2),
    shared.mat
  )
  matMesh.position.z = frameDepth / 2 + 0.001
  group.add(matMesh)

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
  }
  const artMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(artW, artH),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    })
  )
  artMesh.position.z = frameDepth / 2 + 0.003
  group.add(artMesh)

  // Small museum label plaque beneath the frame
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.22, 0.012),
    shared.plaque
  )
  plaque.position.set(0, -outerH / 2 - 0.2, 0.01)
  group.add(plaque)

  group.userData.outerH = outerH
  group.userData.frameDepth = frameDepth
  return group
}

function mountFrameOnWall(
  group: THREE.Group,
  path: THREE.CatmullRomCurve3,
  t: number,
  side: 1 | -1,
  y: number
): void {
  const center = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const lateral = new THREE.Vector3()

  path.getPointAt(t, center)
  path.getTangentAt(t, tangent).setY(0).normalize()
  getLateral(tangent, lateral)

  const [wallLat] = wallProfile(ART_PROFILE_T)
  const frameDepth = (group.userData.frameDepth as number) || 0.04
  const offset = wallLat + frameDepth * 0.5 + 0.01

  group.position.set(
    center.x + lateral.x * side * offset,
    y,
    center.z + lateral.z * side * offset
  )
  group.userData.pathU = t

  const inward = lateral.clone().multiplyScalar(-side)
  const right = new THREE.Vector3()
    .crossVectors(new THREE.Vector3(0, 1, 0), inward)
    .normalize()
  if (right.dot(tangent) < 0) right.negate()
  const up = new THREE.Vector3().crossVectors(inward, right).normalize()
  group.quaternion.setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(right, up, inward)
  )
}

function placeArtworksAlongWalls(
  path: THREE.CatmullRomCurve3,
  artworks: GalleryArtwork[],
  textures: Map<string, THREE.Texture>,
  parent: THREE.Group,
  shared: ReturnType<typeof createFrameMaterials>
): void {
  const count = artworks.length
  if (count === 0) return

  // Generous wall spacing — sparse museum rhythm like the references
  for (let i = 0; i < count; i++) {
    const artwork = artworks[i]!
    const t = 0.06 + (i / Math.max(count - 1, 1)) * 0.86
    const side: 1 | -1 = i % 2 === 0 ? -1 : 1

    const tex = textures.get(artwork.id) ?? null
    const group = createFrameGroup(artwork, tex, shared)
    mountFrameOnWall(group, path, t, side, ART_Y)
    parent.add(group)

    if (artwork.stacked) {
      const neighbor = artworks[(i + 3) % count]!
      const stackTex = textures.get(neighbor.id) ?? tex
      const upper = createFrameGroup(
        { ...neighbor, id: `${artwork.id}-stack`, scale: 0.7, stacked: false },
        stackTex,
        shared,
        0.85
      )
      const outerH = (group.userData.outerH as number) || 1.1
      mountFrameOnWall(upper, path, t, side, ART_Y + outerH * 0.55 + 0.32)
      parent.add(upper)
    }
  }
}

function loadTextures(
  artworks: GalleryArtwork[],
  onProgress?: (loaded: number, total: number) => void
): Promise<Map<string, THREE.Texture>> {
  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin("anonymous")
  const map = new Map<string, THREE.Texture>()
  let loaded = 0
  const total = artworks.length

  return Promise.all(
    artworks.map(
      (art) =>
        new Promise<void>((resolve) => {
          const src = art.src.includes("images.unsplash.com")
            ? art.src.replace(/w=\d+/, "w=640")
            : art.src
          loader.load(
            src,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace
              tex.generateMipmaps = true
              tex.minFilter = THREE.LinearMipmapLinearFilter
              tex.anisotropy = 4
              map.set(art.id, tex)
              loaded += 1
              onProgress?.(loaded, total)
              resolve()
            },
            undefined,
            () => {
              loaded += 1
              onProgress?.(loaded, total)
              resolve()
            }
          )
        })
    )
  ).then(() => map)
}

export async function createGalleryScene(
  canvas: HTMLCanvasElement,
  artworks: GalleryArtwork[],
  onLoadProgress?: (loaded: number, total: number) => void
): Promise<GallerySceneHandle> {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(CEILING_COLOR)
  scene.fog = new THREE.Fog(CEILING_COLOR, 10, 32)

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 40)
  camera.position.set(0, CAM_Y, 6)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = false

  const path = buildCenterPath()
  const panelTex = createPanelTexture()

  const wallMat = new THREE.MeshStandardMaterial({
    color: WALL_COLOR,
    map: panelTex,
    roughness: 0.92,
    metalness: 0,
    side: THREE.FrontSide,
  })
  const wallBackMat = new THREE.MeshBasicMaterial({
    color: WALL_BACK_COLOR,
    side: THREE.FrontSide,
  })
  // Slight sheen so cove light kisses the black floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: FLOOR_COLOR,
    roughness: 0.28,
    metalness: 0.12,
  })
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: CEILING_COLOR,
    roughness: 1,
    metalness: 0,
  })

  const wallChunks: WallChunk[] = [
    ...createWallChunks(path, -1, wallMat, wallBackMat),
    ...createWallChunks(path, 1, wallMat, wallBackMat),
  ]
  for (const chunk of wallChunks) {
    scene.add(chunk.mesh, chunk.backMesh)
  }

  scene.add(new THREE.Mesh(createFloorGeometry(path), floorMat))

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(90, 110), ceilingMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(16, 4.2, -30)
  scene.add(ceiling)

  scene.add(createCoveStrip(path, -1), createCoveStrip(path, 1))

  const coveLightsL = createCoveLights(path, -1, 5)
  const coveLightsR = createCoveLights(path, 1, 5)
  scene.add(coveLightsL, coveLightsR)

  const disks = createCeilingDisks(path, 8)
  scene.add(disks)

  // Soft museum fill — keep walls bright without washing out contrast
  scene.add(new THREE.AmbientLight(0xffffff, 0.38))
  scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 0.55))
  const key = new THREE.PointLight(0xffffff, 1.6, 14, 1.6)
  key.position.set(0, 3.4, 0)
  scene.add(key)

  const frameMats = createFrameMaterials()
  const framesRoot = new THREE.Group()
  scene.add(framesRoot)
  const textures = await loadTextures(artworks, onLoadProgress)
  placeArtworksAlongWalls(path, artworks, textures, framesRoot, frameMats)

  const camPos = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const lookDir = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const lateral = new THREE.Vector3()
  let dirty = true
  let lastProgress = 0
  let lookYawNorm = 0

  const updateChunkVisibility = (progress: number) => {
    // Only show corridor ahead of the camera — hide walls behind
    const behind = 0.04
    const ahead = 0.42
    for (const chunk of wallChunks) {
      const visible =
        chunk.u1 >= progress - behind && chunk.u0 <= progress + ahead
      chunk.mesh.visible = visible
      chunk.backMesh.visible = visible
    }
    framesRoot.children.forEach((child) => {
      const u = child.userData.pathU as number | undefined
      if (u == null) return
      child.visible = u >= progress - behind && u <= progress + ahead
    })
    const cullLights = (group: THREE.Group) => {
      group.children.forEach((child) => {
        const u = child.userData.pathU as number | undefined
        if (u == null) return
        child.visible = u >= progress - behind && u <= progress + ahead
      })
    }
    cullLights(disks)
    cullLights(coveLightsL)
    cullLights(coveLightsR)
  }

  const applyCamera = () => {
    path.getPointAt(lastProgress, camPos)
    camPos.y = CAM_Y
    camera.position.copy(camPos)

    path.getTangentAt(lastProgress, tangent).setY(0)
    if (tangent.lengthSq() < 1e-8) tangent.set(0, 0, -1)
    tangent.normalize()
    getLateral(tangent, lateral)

    // Path heading + mouse yaw (look left / right)
    const yaw = lookYawNorm * MAX_LOOK_YAW
    const cos = Math.cos(yaw)
    const sin = Math.sin(yaw)
    lookDir
      .set(
        tangent.x * cos + lateral.x * sin,
        0,
        tangent.z * cos + lateral.z * sin
      )
      .normalize()

    lookTarget.set(
      camPos.x + lookDir.x,
      CAM_Y - 0.02,
      camPos.z + lookDir.z
    )
    camera.up.set(0, 1, 0)
    camera.lookAt(lookTarget)

    key.position.set(camPos.x, 3.35, camPos.z)
    updateChunkVisibility(lastProgress)
    dirty = true
  }

  const setProgress = (t: number) => {
    const clamped = THREE.MathUtils.clamp(t, 0, 1)
    if (Math.abs(clamped - lastProgress) < 0.00015) return
    lastProgress = clamped
    applyCamera()
  }

  const setLookYaw = (normalizedX: number) => {
    const next = THREE.MathUtils.clamp(normalizedX, -1, 1)
    if (Math.abs(next - lookYawNorm) < 0.002) return
    lookYawNorm = next
    applyCamera()
  }

  applyCamera()

  const clearFrames = () => {
    while (framesRoot.children.length) {
      const child = framesRoot.children[0]!
      framesRoot.remove(child)
      child.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const m = obj.material
          if (m instanceof THREE.MeshBasicMaterial) m.dispose()
        }
      })
    }
  }

  const setArtworks = async (next: GalleryArtwork[]) => {
    clearFrames()
    textures.forEach((tex) => tex.dispose())
    textures.clear()
    const nextTextures = await loadTextures(next)
    nextTextures.forEach((tex, id) => textures.set(id, tex))
    placeArtworksAlongWalls(path, next, textures, framesRoot, frameMats)
    updateChunkVisibility(lastProgress)
    dirty = true
  }

  const resize = (width: number, height: number) => {
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    dirty = true
  }

  const render = () => {
    if (!dirty) return
    dirty = false
    renderer.render(scene, camera)
  }

  const dispose = () => {
    renderer.dispose()
    panelTex.dispose()
    wallBackMat.dispose()
    frameMats.frame.dispose()
    frameMats.mat.dispose()
    frameMats.plaque.dispose()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        const m = obj.material
        if (Array.isArray(m)) m.forEach((x) => x.dispose())
        else if (
          m !== frameMats.frame &&
          m !== frameMats.mat &&
          m !== frameMats.plaque &&
          m !== wallMat &&
          m !== wallBackMat
        ) {
          m.dispose()
        }
      }
    })
    wallMat.dispose()
    textures.forEach((tex) => tex.dispose())
  }

  return {
    scene,
    camera,
    renderer,
    setProgress,
    setLookYaw,
    setArtworks,
    resize,
    render,
    dispose,
  }
}
