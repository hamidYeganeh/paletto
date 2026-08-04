export type GalleryArtwork = {
  id: string
  src: string
  title: string
  artist: string
  year: string
  /** Aspect ratio width / height — portrait ≈ 0.75, square = 1 */
  aspect: number
  /** Relative size scale of the frame */
  scale?: number
  /** Stack a second smaller frame above this one */
  stacked?: boolean
}

/**
 * Wall art for the organic museum walkthrough.
 * Mostly monochrome / fashion editorial — matches the reference halls.
 */
export const galleryArtworks: GalleryArtwork[] = [
  {
    id: "01",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80&sat=-100",
    title: "Portrait Study",
    artist: "Studio Collection",
    year: "۲۰۲۱",
    aspect: 0.8,
    scale: 1.1,
  },
  {
    id: "02",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80&sat=-100",
    title: "Soft Light",
    artist: "Studio Collection",
    year: "۲۰۱۹",
    aspect: 0.75,
    scale: 0.95,
    stacked: true,
  },
  {
    id: "03",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&sat=-100",
    title: "Silhouette",
    artist: "Studio Collection",
    year: "۲۰۱۸",
    aspect: 0.65,
    scale: 1.1,
  },
  {
    id: "04",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&sat=-100",
    title: "Stillness",
    artist: "Studio Collection",
    year: "۲۰۱۸",
    aspect: 0.85,
    scale: 1.05,
  },
  {
    id: "05",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&sat=-100",
    title: "Form",
    artist: "Studio Collection",
    year: "۲۰۲۲",
    aspect: 0.68,
    scale: 1.15,
    stacked: true,
  },
  {
    id: "06",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80&sat=-100",
    title: "Monochrome",
    artist: "Studio Collection",
    year: "۲۰۲۰",
    aspect: 0.8,
    scale: 1,
  },
  {
    id: "07",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80&sat=-100",
    title: "Contrast",
    artist: "Studio Collection",
    year: "۲۰۲۱",
    aspect: 0.7,
    scale: 1.2,
  },
  {
    id: "08",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80&sat=-100",
    title: "Presence",
    artist: "Studio Collection",
    year: "۲۰۱۹",
    aspect: 0.7,
    scale: 1.05,
  },
  {
    id: "09",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80&sat=-100",
    title: "Gaze",
    artist: "Studio Collection",
    year: "۲۰۱۷",
    aspect: 0.82,
    scale: 0.95,
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=80&sat=-100",
    title: "Frame",
    artist: "Studio Collection",
    year: "۲۰۲۳",
    aspect: 0.75,
    scale: 1,
    stacked: true,
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80&sat=-100",
    title: "Quiet",
    artist: "Studio Collection",
    year: "۲۰۲۰",
    aspect: 0.78,
    scale: 0.92,
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80&sat=-100",
    title: "Bloom",
    artist: "Studio Collection",
    year: "۲۰۲۱",
    aspect: 0.8,
    scale: 0.95,
  },
  {
    id: "13",
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80&sat=-100",
    title: "Dress",
    artist: "Studio Collection",
    year: "۲۰۱۷",
    aspect: 0.72,
    scale: 1,
  },
  {
    id: "14",
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80&sat=-100",
    title: "Editorial",
    artist: "Studio Collection",
    year: "۲۰۲۰",
    aspect: 0.7,
    scale: 1.1,
    stacked: true,
  },
  {
    id: "15",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&sat=-100",
    title: "Study II",
    artist: "Studio Collection",
    year: "۲۰۲۲",
    aspect: 0.8,
    scale: 0.9,
  },
  {
    id: "16",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=80&sat=-100",
    title: "Street",
    artist: "Studio Collection",
    year: "۲۰۱۹",
    aspect: 0.8,
    scale: 0.95,
  },
]
