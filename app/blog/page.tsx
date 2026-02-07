import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, blogCategories } from '@/data/blog-posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'

export const metadata: Metadata = {
  title: 'Wijnverhalen — Vino12',
  description: 'Wijnverhalen, food pairings, regio-informatie en tips van Vino12.',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-offwhite pt-20">
        <div className="container-brutal px-4 py-8 md:px-8 md:py-12">
          <div className="mb-8">
            <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-2">
              Wijnverhalen
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4">
              Blog
            </h1>
            <p className="font-body text-xl text-ink/60 max-w-2xl">
              Ontdek de wereld van wijn. Van beginnersgidsen tot wijnregio-verhalen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group border-brutal border-ink bg-offwhite brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.8)] transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-accent text-[10px] uppercase tracking-widest text-wine border border-wine px-2 py-0.5">
                      {blogCategories[post.category]}
                    </span>
                    <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                      {post.readTime} min
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mb-2 group-hover:text-wine transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-body text-base text-ink/60 mb-4">{post.excerpt}</p>
                  <time className="font-accent text-[10px] uppercase tracking-widest text-ink/30">
                    {new Date(post.date).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <MarqueeStrip text="VINO12 ★ WIJNVERHALEN ★ FOOD PAIRINGS ★ REGIO GUIDES ★ WIJN TIPS" />
      </main>
      <Footer />
    </>
  )
}
