"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { marqueeRadiusClass, studioProjects } from "./projects"

export function ProjectMarquee() {
  const t = useTranslations("Artworks")
  const items = [...studioProjects, ...studioProjects]

  return (
    <section
      data-journey-section="marquee"
      className="studio-marquee relative z-[2] py-12"
      aria-label="پروژه‌ها"
    >
      <div className="studio-marquee-track">
        {items.map((project, index) => {
          const radius = marqueeRadiusClass[index % marqueeRadiusClass.length]
          return (
            <article
              key={`${project.id}-${index}`}
              className="group relative w-[42vw] max-w-[280px] shrink-0 overflow-hidden sm:max-w-[320px]"
            >
              <div
                className={`studio-img-wrap relative aspect-[5/7] overflow-hidden bg-neutral-100 ${radius}`}
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="320px"
                  className="studio-img object-cover"
                />
              </div>
              <p className="studio-mono mt-3 text-[#737373]">
                {t(project.titleKey)}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
