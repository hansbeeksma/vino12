import Image from 'next/image'
import type { Wine } from '@/lib/types'
import { colorHex, colorLabel, formatPrice } from '@/lib/utils'
import { BrutalBadge } from '@/components/ui/BrutalBadge'
import { BodyScale } from './BodyScale'
import { TastingProfile } from './TastingProfile'
import { PairingTags } from './PairingTags'
import { WishlistButton } from './WishlistButton'

interface WineDetailProps {
  wine: Wine
}

export function WineDetail({ wine }: WineDetailProps) {
  const isRed = wine.color === 'red'

  return (
    <div className="container-brutal px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Product photo */}
        <div className="border-brutal border-ink brutal-shadow bg-offwhite aspect-[3/4] flex items-center justify-center relative p-8">
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{ backgroundColor: colorHex(wine.color) }}
          />
          <Image
            src={wine.image}
            alt={`${wine.name} - ${wine.region}`}
            width={500}
            height={667}
            className="object-contain max-h-full w-auto"
            priority
          />
          <div className="absolute bottom-4 right-4">
            <span className="font-display text-6xl font-bold text-ink/5">#{wine.id}</span>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <BrutalBadge variant={isRed ? 'wine' : 'emerald'}>
                {colorLabel(wine.color)}
              </BrutalBadge>
              <BrutalBadge variant="champagne">{wine.body}</BrutalBadge>
              <BrutalBadge variant="ink">{wine.countryCode}</BrutalBadge>
            </div>
            <h1 className="font-display text-display-lg text-ink mb-2">{wine.name}</h1>
            <p className="font-accent text-sm uppercase tracking-widest text-ink/60">
              {wine.grape} — {wine.region}, {wine.country}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-display text-4xl font-bold text-wine">
              {formatPrice(wine.price)}
            </span>
            <span className="font-accent text-xs text-ink/50">
              {wine.year} · {wine.alcohol}
            </span>
            <WishlistButton wineId={wine.id} />
          </div>

          <BodyScale body={wine.body} color={isRed ? 'bg-wine' : 'bg-emerald'} />

          <p className="font-body text-base md:text-lg lg:text-xl leading-relaxed">
            {wine.description}
          </p>

          <div className="border-t-2 border-ink pt-6">
            <h3 className="font-accent text-xs uppercase tracking-widest text-wine mb-4">
              Proefnotities
            </h3>
            <TastingProfile notes={wine.tastingNotes} />
          </div>

          <div className="border-t-2 border-ink pt-6">
            <h3 className="font-accent text-xs uppercase tracking-widest text-wine mb-4">
              Past bij
            </h3>
            <PairingTags pairings={wine.pairings} />
          </div>

          <div className="border-brutal border-ink bg-champagne p-4 brutal-shadow">
            <p className="font-accent text-xs uppercase tracking-widest text-wine mb-1">
              Wist je dat?
            </p>
            <p className="font-body text-lg">{wine.funFact}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
