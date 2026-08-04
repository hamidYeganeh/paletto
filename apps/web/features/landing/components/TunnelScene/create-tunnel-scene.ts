import gsap from "gsap"
import * as THREE from "three"

export type TunnelSceneHandle = {
  setScrollDepth: (scrollY: number) => void
  /** Returns true when the camera is still easing toward the scroll target */
  isMoving: () => boolean
  resize: (width: number, height: number) => void
  render: () => boolean
  dispose: () => void
}

type TunnelConfig = {
  imageUrls: string[]
  background?: number
  fogDensity?: number
  /** Called when the scene needs another painted frame (texture load, fade, etc.) */
  onDirty?: () => void
}

const TUNNEL_WIDTH = 24
const TUNNEL_HEIGHT = 16
const SEGMENT_DEPTH = 6
/** Fewer segments = less GPU fill; fog hides the far end anyway */
const NUM_SEGMENTS = 10
const FLOOR_COLS = 6
const WALL_ROWS = 4
const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS
const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS
const SCROLL_TO_Z = 0.05
const CAMERA_LERP = 0.12
const SETTLE_EPSILON = 0.002
const LINE_COLOR = 0x555555
const LINE_OPACITY = 0.35
const SLAB_OPACITY = 0.85
const CELL_MARGIN = 0.4

type SlabSlot = {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
}

function pickUrl(urls: string[]): string {
  return urls[Math.floor(Math.random() * urls.length)]!
}

/** Prefer smaller remote assets for tunnel slabs (GPU + bandwidth). */
export function tunnelImageUrl(src: string): string {
  try {
    const url = new URL(src)
    if (url.hostname.includes("unsplash.com")) {
      url.searchParams.set("w", "480")
      url.searchParams.set("q", "70")
      url.searchParams.set("auto", "format")
      url.searchParams.set("fit", "crop")
      return url.toString()
    }
  } catch {
    /* local / relative */
  }
  return src
}

/**
 * Infinite image tunnel — adapted from
 * https://github.com/thebuggeddev/delphi
 *
 * Performance notes:
 * - Textures are pooled and reused (no reload on segment recycle)
 * - Meshes/geometries are created once; recycle only repositions + swaps maps
 * - `render()` returns whether another frame is needed (camera still lerping)
 */
export function createTunnelScene(
  canvas: HTMLCanvasElement,
  config: TunnelConfig
): TunnelSceneHandle {
  const {
    imageUrls: rawUrls,
    background = 0x050505,
    fogDensity = 0.022,
    onDirty,
  } = config

  const imageUrls = rawUrls.map(tunnelImageUrl)
  if (!imageUrls.length) {
    throw new Error("createTunnelScene requires at least one image URL")
  }

  let scrollDepth = 0
  let settled = false

  const markDirty = () => {
    settled = false
    onDirty?.()
  }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(background)
  scene.fog = new THREE.FogExp2(background, fogDensity)

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200)
  camera.position.set(0, 0, 0)

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: false,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // Cap DPR — retina × antialias is the usual GPU hotspot
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5))

  const textureLoader = new THREE.TextureLoader()
  textureLoader.crossOrigin = "anonymous"

  /** Shared texture pool — loaded once, never disposed until scene teardown */
  const texturePool: THREE.Texture[] = []
  const pendingLoads = new Map<string, Promise<THREE.Texture | null>>()
  const segments: THREE.Group[] = []
  /** Slab slots per segment — recycled in place */
  const segmentSlabs: SlabSlot[][] = []

  // Shared geometries (one per orientation / size)
  const floorGeom = new THREE.PlaneGeometry(
    COL_WIDTH - CELL_MARGIN,
    SEGMENT_DEPTH - CELL_MARGIN
  )
  const wallGeom = new THREE.PlaneGeometry(
    SEGMENT_DEPTH - CELL_MARGIN,
    ROW_HEIGHT - CELL_MARGIN
  )
  const sharedLineMaterial = new THREE.LineBasicMaterial({
    color: LINE_COLOR,
    transparent: true,
    opacity: LINE_OPACITY,
  })

  function loadTexture(url: string): Promise<THREE.Texture | null> {
    const existing = texturePool.find((t) => t.userData.url === url)
    if (existing) return Promise.resolve(existing)

    const inflight = pendingLoads.get(url)
    if (inflight) return inflight

    const promise = new Promise<THREE.Texture | null>((resolve) => {
      textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
          tex.generateMipmaps = false
          tex.userData.url = url
          texturePool.push(tex)
          pendingLoads.delete(url)
          resolve(tex)
        },
        undefined,
        () => {
          pendingLoads.delete(url)
          resolve(null)
        }
      )
    })
    pendingLoads.set(url, promise)
    return promise
  }

  function assignTexture(slot: SlabSlot, url: string, fadeIn: boolean) {
    void loadTexture(url).then((tex) => {
      if (!tex || !slot.material) return
      slot.material.map = tex
      slot.material.needsUpdate = true
      if (fadeIn) {
        slot.material.opacity = 0
        gsap.to(slot.material, {
          opacity: SLAB_OPACITY,
          duration: 0.7,
          ease: "power1.out",
          overwrite: true,
          // Keep the render loop alive for the duration of the fade
          onUpdate: markDirty,
          onComplete: markDirty,
        })
      } else {
        slot.material.opacity = SLAB_OPACITY
      }
      markDirty()
    })
  }

  function createSlab(
    geom: THREE.BufferGeometry,
    pos: THREE.Vector3,
    rot: THREE.Euler
  ): SlabSlot {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geom, material)
    mesh.position.copy(pos)
    mesh.rotation.copy(rot)
    mesh.frustumCulled = true
    return { mesh, material }
  }

  function buildSegmentSlots(
    group: THREE.Group,
    w: number,
    h: number,
    d: number
  ): SlabSlot[] {
    const slots: SlabSlot[] = []

    const tryAdd = (
      geom: THREE.BufferGeometry,
      pos: THREE.Vector3,
      rot: THREE.Euler,
      chance: number,
      lastIdx: number,
      i: number
    ): number => {
      if (i <= lastIdx + 1 || Math.random() <= chance) return lastIdx
      const slot = createSlab(geom, pos, rot)
      group.add(slot.mesh)
      slots.push(slot)
      assignTexture(slot, pickUrl(imageUrls), true)
      return i
    }

    let lastFloor = -999
    for (let i = 0; i < FLOOR_COLS; i++) {
      lastFloor = tryAdd(
        floorGeom,
        new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2),
        new THREE.Euler(-Math.PI / 2, 0, 0),
        0.72,
        lastFloor,
        i
      )
    }

    let lastCeil = -999
    for (let i = 0; i < FLOOR_COLS; i++) {
      lastCeil = tryAdd(
        floorGeom,
        new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2),
        new THREE.Euler(Math.PI / 2, 0, 0),
        0.85,
        lastCeil,
        i
      )
    }

    let lastLeft = -999
    for (let i = 0; i < WALL_ROWS; i++) {
      lastLeft = tryAdd(
        wallGeom,
        new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
        new THREE.Euler(0, Math.PI / 2, 0),
        0.72,
        lastLeft,
        i
      )
    }

    let lastRight = -999
    for (let i = 0; i < WALL_ROWS; i++) {
      lastRight = tryAdd(
        wallGeom,
        new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
        new THREE.Euler(0, -Math.PI / 2, 0),
        0.72,
        lastRight,
        i
      )
    }

    return slots
  }

  function createSegment(zPos: number) {
    const group = new THREE.Group()
    group.position.z = zPos
    group.matrixAutoUpdate = true

    const w = TUNNEL_WIDTH / 2
    const h = TUNNEL_HEIGHT / 2
    const d = SEGMENT_DEPTH

    const vertices: number[] = []
    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + i * COL_WIDTH
      vertices.push(x, -h, 0, x, -h, -d)
      vertices.push(x, h, 0, x, h, -d)
    }
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + i * ROW_HEIGHT
      vertices.push(-w, y, 0, -w, y, -d)
      vertices.push(w, y, 0, w, y, -d)
    }
    vertices.push(-w, -h, 0, w, -h, 0)
    vertices.push(-w, h, 0, w, h, 0)
    vertices.push(-w, -h, 0, -w, h, 0)
    vertices.push(w, -h, 0, w, h, 0)

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    group.add(new THREE.LineSegments(lineGeo, sharedLineMaterial))

    const slots = buildSegmentSlots(group, w, h, d)
    segmentSlabs.push(slots)
    return group
  }

  /** Reposition only — swap textures from the pool, never reload from network */
  function recycleSegment(segment: THREE.Group, index: number, newZ: number) {
    segment.position.z = newZ
    const slots = segmentSlabs[index]
    if (!slots) return

    for (const slot of slots) {
      if (texturePool.length === 0) continue
      const tex = texturePool[Math.floor(Math.random() * texturePool.length)]!
      slot.material.map = tex
      slot.material.opacity = SLAB_OPACITY
      slot.material.needsUpdate = true
    }
  }

  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const segment = createSegment(-i * SEGMENT_DEPTH)
    scene.add(segment)
    segments.push(segment)
  }

  // Kick off remaining pool loads so recycle has variety
  for (const url of imageUrls) {
    void loadTexture(url)
  }

  function setScrollDepth(scrollY: number) {
    if (scrollDepth === scrollY) return
    scrollDepth = scrollY
    markDirty()
  }

  function isMoving() {
    return !settled
  }

  function resize(width: number, height: number) {
    const w = Math.max(1, Math.floor(width))
    const h = Math.max(1, Math.floor(height))
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
    markDirty()
  }

  function render(): boolean {
    const targetZ = -scrollDepth * SCROLL_TO_Z
    const dz = targetZ - camera.position.z
    camera.position.z += dz * CAMERA_LERP

    const camZ = camera.position.z
    const tunnelLength = NUM_SEGMENTS * SEGMENT_DEPTH

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!
      if (segment.position.z > camZ + SEGMENT_DEPTH) {
        let minZ = 0
        for (const s of segments) minZ = Math.min(minZ, s.position.z)
        recycleSegment(segment, i, minZ - SEGMENT_DEPTH)
      } else if (segment.position.z < camZ - tunnelLength - SEGMENT_DEPTH) {
        let maxZ = -Infinity
        for (const s of segments) maxZ = Math.max(maxZ, s.position.z)
        recycleSegment(segment, i, maxZ + SEGMENT_DEPTH)
      }
    }

    renderer.render(scene, camera)

    settled = Math.abs(targetZ - camera.position.z) < SETTLE_EPSILON
    return !settled
  }

  function dispose() {
    gsap.killTweensOf(
      segmentSlabs.flatMap((slots) => slots.map((s) => s.material))
    )

    for (const slots of segmentSlabs) {
      for (const slot of slots) {
        slot.material.map = null
        slot.material.dispose()
      }
    }
    segmentSlabs.length = 0

    for (const segment of segments) {
      segment.traverse((c) => {
        if (c instanceof THREE.LineSegments) {
          c.geometry.dispose()
        }
      })
      scene.remove(segment)
    }
    segments.length = 0

    floorGeom.dispose()
    wallGeom.dispose()
    sharedLineMaterial.dispose()

    for (const tex of texturePool) tex.dispose()
    texturePool.length = 0
    pendingLoads.clear()

    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { setScrollDepth, isMoving, resize, render, dispose }
}
