import type { Metadata } from "next"

import { GalleryWalkthrough } from "@/components/gallery/gallery-walkthrough"
import "@/app/gallery-demo.css"

export const metadata: Metadata = {
  title: "گالری دمو — پالتو",
  description: "پیمایش سه‌بعدی در راهروی نگارخانه با آثار پویا روی دیوار.",
}

export default function GalleryDemoPage() {
  return <GalleryWalkthrough />
}
