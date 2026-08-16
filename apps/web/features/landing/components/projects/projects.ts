export const PLACEHOLDER_IMAGE = "/images/placeholder.png"

export type StudioProject = {
  id: string
  titleKey: string
  categoryKey: string
  year: string
  image: string
  alt: string
}

export const studioProjects: StudioProject[] = [
  {
    id: "mona-lisa",
    titleKey: "mona-lisa",
    categoryKey: "mona-lisa",
    year: "۱۵۰۳",
    image: PLACEHOLDER_IMAGE,
    alt: "نقاشی پرتره کلاسیک",
  },
  {
    id: "starry-night",
    titleKey: "starry-night",
    categoryKey: "starry-night",
    year: "۱۸۸۹",
    image: PLACEHOLDER_IMAGE,
    alt: "نقاشی رنگ‌روغن اکسپرسیو",
  },
  {
    id: "pearl-earring",
    titleKey: "pearl-earring",
    categoryKey: "pearl-earring",
    year: "۱۶۶۵",
    image: PLACEHOLDER_IMAGE,
    alt: "پرتره در نگارخانه",
  },
  {
    id: "the-kiss",
    titleKey: "the-kiss",
    categoryKey: "the-kiss",
    year: "۱۹۰۸",
    image: PLACEHOLDER_IMAGE,
    alt: "جزئیات تزیینی نقاشی",
  },
  {
    id: "great-wave",
    titleKey: "great-wave",
    categoryKey: "great-wave",
    year: "۱۸۳۱",
    image: PLACEHOLDER_IMAGE,
    alt: "چاپ هنری موج بزرگ",
  },
  {
    id: "birth-of-venus",
    titleKey: "birth-of-venus",
    categoryKey: "birth-of-venus",
    year: "۱۴۸۶",
    image: PLACEHOLDER_IMAGE,
    alt: "نقاشی دوره رنسانس",
  },
]

export const marqueeRadiusClass = [
  "studio-marquee-card--a",
  "studio-marquee-card--b",
  "studio-marquee-card--c",
] as const
