import { CustomCursor } from "../../components/CustomCursor"
import { JourneyLine } from "../../components/JourneyLine"
import { LandingHeader } from "../../components/LandingHeader"
import { LandingScrollIsland } from "../../components/LandingScrollIsland"
import { LandingFooterSection } from "../../sections/LandingFooterSection"
import { LandingHeroSection } from "../../sections/LandingHeroSection"
import { LandingHorizontalGallerySection } from "../../sections/LandingHorizontalGallerySection"
import { LandingIntroSection } from "../../sections/LandingIntroSection"
import { LandingJourneySection } from "../../sections/LandingJourneySection"
import { LandingMarqueeSection } from "../../sections/LandingMarqueeSection"
import { LandingParallaxSection } from "../../sections/LandingParallaxSection"
import { LandingProjectGridSection } from "../../sections/LandingProjectGridSection"
import { LandingStickySwitchSection } from "../../sections/LandingStickySwitchSection"

export function LandingScreen() {
  return (
    <div className="studio-page min-h-screen">
      <CustomCursor />
      <LandingHeader />
      <LandingScrollIsland />
      <main>
        <LandingHeroSection />
        <div className="studio-journey-track relative">
          <JourneyLine />
          <LandingMarqueeSection />
          <LandingIntroSection />
          <LandingJourneySection />
          <LandingStickySwitchSection />
          <LandingParallaxSection />
          <LandingHorizontalGallerySection />
          <LandingProjectGridSection />
        </div>
      </main>
      <LandingFooterSection />
    </div>
  )
}
