import type { MetadataRoute } from 'next'
import { wines } from '@/lib/wines'
import { blogPosts } from '@/data/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vino12.com'

  const winePages = wines.map((wine) => ({
    url: `${base}/wijn/${wine.slug}`,
    lastModified: new Date(),
  }))

  const blogPages = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/wijnen`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...winePages,
    ...blogPages,
  ]
}
