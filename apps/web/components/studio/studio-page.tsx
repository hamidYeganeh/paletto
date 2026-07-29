import { CustomCursor } from "./custom-cursor"
import { Hero } from "./hero"
import { HorizontalGallery } from "./horizontal-gallery"
import { Intro } from "./intro"
import { JourneyChapter, JourneyLine } from "./journey-line"
import { ParallaxTiltGrid } from "./parallax-tilt-grid"
import { ProjectGrid } from "./project-grid"
import { ProjectMarquee } from "./project-marquee"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { StickyContentSwitch } from "./sticky-content-switch"

export function StudioPage() {
  return (
    <div className="studio-page min-h-screen">
      <CustomCursor />
      <SiteHeader />
      <main>
        <Hero />
        <div className="studio-journey-track relative">
          <JourneyLine />
          <ProjectMarquee />
          <Intro />
          <JourneyChapter />
          <StickyContentSwitch />
          <ParallaxTiltGrid />
          <HorizontalGallery />
          <ProjectGrid />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
