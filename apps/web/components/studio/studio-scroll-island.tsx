"use client"

import { useTranslations } from "next-intl"
import { ScrollIsland, type Topic } from "@/components/ui/scroll-island"

const TOPIC_IDS = [
  "top",
  "intro",
  "journey",
  "collections",
  "parallax",
  "horizontal",
  "works",
  "contact",
] as const

export function StudioScrollIsland() {
  const t = useTranslations("ScrollIsland")

  const topics: Topic[] = TOPIC_IDS.map((id) => ({
    id,
    title: t(`topics.${id}`),
  }))

  return <ScrollIsland topics={topics} label={t("label")} />
}
