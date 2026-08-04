import type { Metadata } from "next"

import { GalleryDemoScreen } from "@/features/gallery"
import "@/app/gallery-demo.css"

export const metadata: Metadata = {
  title: "گالری دمو — پالتو",
  description: "پیمایش سه‌بعدی در راهروی نگارخانه با آثار پویا روی دیوار.",
}

export default function GalleryDemoPage() {
  return <GalleryDemoScreen />
}
