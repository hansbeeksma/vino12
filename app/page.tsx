import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'
import { CollectionGrid } from '@/components/sections/CollectionGrid'
import { WineJourney } from '@/components/sections/WineJourney'
import { StatsBar } from '@/components/sections/StatsBar'
import { StoriesCarousel } from '@/components/sections/StoriesCarousel'
import { PhilosophySection } from '@/components/sections/PhilosophySection'
import { CtaSection } from '@/components/sections/CtaSection'
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup'
import { TrendingWines } from '@/components/wine/TrendingWines'
import { getOrganizationJsonLd, getWebsiteJsonLd, getProductJsonLd } from '@/lib/structured-data'

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd()) }}
      />
      <Header />
      <main>
        <HeroSection />
        <MarqueeStrip text="6 ROOD ★ 6 WIT ★ 12 FLESSEN ★ PERFECTE BALANS ★ €175 PER BOX ★ GRATIS VERZENDING" />
        <CollectionGrid />
        <WineJourney />
        <StatsBar />
        <StoriesCarousel />
        <PhilosophySection />
        <TrendingWines />
        <CtaSection />
        <section className="container-brutal px-4 py-12 md:px-8 md:py-16">
          <NewsletterSignup />
        </section>
      </main>
      <Footer />
    </>
  )
}
