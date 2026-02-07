import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  blogPosts,
  getBlogPostBySlug,
  blogCategories,
} from "@/../../data/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Niet gevonden | VINO12" };

  return {
    title: `${post.title} | VINO12 Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal px-4 py-8 md:px-8 max-w-3xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/blog"
            className="font-accent text-xs uppercase tracking-widest text-ink/50 hover:text-wine"
          >
            &larr; Terug naar blog
          </Link>
        </nav>

        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-accent text-[10px] uppercase tracking-widest bg-champagne border-2 border-ink px-2 py-0.5">
                {blogCategories[post.category]}
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                {post.readTime} min leestijd
              </span>
            </div>
            <h1 className="font-display text-display-lg text-ink mb-4">
              {post.title}
            </h1>
            <time className="font-accent text-xs uppercase tracking-widest text-ink/40">
              {new Date(post.date).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <div className="border-t-2 border-ink pt-8 prose-brutal">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="font-display text-2xl font-bold text-ink mt-8 mb-4"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="font-display text-xl font-bold text-ink mt-6 mb-3"
                  >
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ") || block.startsWith("1. ")) {
                const items = block.split("\n");
                const isOrdered = block.startsWith("1.");
                const Tag = isOrdered ? "ol" : "ul";
                return (
                  <Tag
                    key={i}
                    className={`font-body text-base leading-relaxed mb-4 pl-6 space-y-1 ${
                      isOrdered ? "list-decimal" : "list-disc"
                    }`}
                  >
                    {items.map((item, j) => (
                      <li key={j}>
                        {item.replace(/^[-\d]+\.\s*/, "").replace(/^\s*/, "")}
                      </li>
                    ))}
                  </Tag>
                );
              }
              if (block.startsWith("|")) {
                const rows = block.split("\n").filter((r) => !r.match(/^\|[-|]+\|$/));
                return (
                  <div key={i} className="overflow-x-auto mb-4">
                    <table className="w-full border-2 border-ink font-body text-sm">
                      <tbody>
                        {rows.map((row, j) => (
                          <tr key={j} className={j === 0 ? "bg-champagne font-bold" : ""}>
                            {row
                              .split("|")
                              .filter(Boolean)
                              .map((cell, k) => (
                                <td key={k} className="border border-ink/20 px-3 py-2">
                                  {cell.trim()}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  className="font-body text-base md:text-lg leading-relaxed mb-4"
                >
                  {block}
                </p>
              );
            })}
          </div>
        </article>

        <div className="mt-12 border-t-2 border-ink pt-8">
          <Link
            href="/blog"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine border-2 border-ink px-4 py-2 brutal-shadow brutal-hover inline-block"
          >
            &larr; Alle artikelen
          </Link>
        </div>
      </div>
    </div>
  );
}
