import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, blogCategories } from "@/../../data/blog-posts";

export const metadata: Metadata = {
  title: "Blog | VINO12",
  description:
    "Wijnkennis, food pairing tips en verhalen uit de mooiste wijnregio's.",
};

export default function BlogPage() {
  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal px-4 py-8 md:px-8">
        <h1 className="font-display text-display-lg text-ink mb-2">Blog</h1>
        <p className="font-body text-lg text-ink/70 mb-12">
          Wijnkennis, food pairing tips en verhalen uit de mooiste
          wijnregio&apos;s.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="border-brutal border-ink brutal-shadow brutal-hover bg-offwhite p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-accent text-[10px] uppercase tracking-widest bg-champagne border-2 border-ink px-2 py-0.5">
                    {blogCategories[post.category]}
                  </span>
                  <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                    {post.readTime} min
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-ink mb-3 group-hover:text-wine transition-colors">
                  {post.title}
                </h2>
                <p className="font-body text-sm text-ink/70 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <time className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                  {new Date(post.date).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
