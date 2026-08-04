"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"

import { studioProjects } from "../../components/projects"

export function LandingProjectGridSection() {
  const tArt = useTranslations("Artworks")
  const tWorks = useTranslations("Works.items")
  const t = useTranslations("Works")

  return (
    <section
      id="works"
      data-journey-section="works"
      className="relative z-[2] px-6 pb-24 md:pb-32"
    >
      <div className="mb-12 flex items-end justify-between gap-4 border-t border-black/10 pt-8">
        <h2 className="studio-headline text-[clamp(2rem,4vw,3rem)] tracking-tighter">
          {t("title")}
        </h2>
        <p className="studio-mono text-[#737373]">{t("eyebrow")}</p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
        {studioProjects.map((project) => (
          <a key={project.id} href={`#${project.id}`} className="group block">
            <div className="studio-img-wrap relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="studio-img object-cover"
              />
              <div className="studio-project-overlay absolute inset-0" />
              <span className="studio-project-arrow absolute top-4 end-4 text-black">
                <ArrowUpRight size={24} strokeWidth={1.5} />
              </span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 border-t border-black/10 pt-4">
              <div>
                <h3 className="studio-headline text-2xl tracking-tighter">
                  {tArt(project.titleKey)}
                </h3>
                <p className="studio-mono mt-2 text-[#737373]">
                  {tWorks(`${project.id}.category`)}
                </p>
              </div>
              <span className="studio-mono shrink-0 text-[#737373]">
                {project.year}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
