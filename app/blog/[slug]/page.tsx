import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, getBlogPostBySlug, blogCategories } from '@/data/blog-posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Artikel niet gevonden' }

  return {
    title: `${post.title} — Vino12 Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-offwhite pt-20">
        <article className="container-brutal px-4 py-8 md:px-8 md:py-12 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="font-accent text-xs uppercase tracking-widest text-ink/50 mb-8">
            <Link href="/" className="hover:text-wine">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-wine">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{post.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-accent text-[10px] uppercase tracking-widest text-wine border border-wine px-2 py-0.5">
                {blogCategories[post.category]}
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                {post.readTime} min leestijd
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
              {post.title}
            </h1>
            <time className="font-accent text-xs uppercase tracking-widest text-ink/40">
              {new Date(post.date).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none font-body text-ink/80 [&_h2]:font-display [&_h2]:text-ink [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-ink [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_strong]:text-wine [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_table]:w-full [&_table]:border-2 [&_table]:border-ink [&_th]:border [&_th]:border-ink [&_th]:p-2 [&_th]:bg-champagne/30 [&_th]:font-accent [&_th]:text-xs [&_th]:uppercase [&_td]:border [&_td]:border-ink/20 [&_td]:p-2">
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
              if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>
              if (line.startsWith('| ')) return null // skip table for now
              if (line.trim() === '') return null
              return <p key={i}>{line}</p>
            })}
          </div>

          {/* Back link */}
          <div className="mt-12 pt-6 border-t-2 border-ink">
            <Link
              href="/blog"
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
            >
              &larr; Alle artikelen
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
