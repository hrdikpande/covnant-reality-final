import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, blogPosts } from "@/lib/blog/posts";
import { JsonLd, getBlogPostingSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `https://www.covnantreality.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.covnantreality.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "Covnant Reality",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Simple markdown-to-html conversion for headings, paragraphs, lists, tables, links, bold
  const contentHtml = post.content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return `<h2 class="text-2xl font-bold text-text-primary mt-10 mb-4">${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3 class="text-xl font-semibold text-text-primary mt-8 mb-3">${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith("| ")) return `<div class="overflow-x-auto my-4"><table class="w-full text-sm border border-border"><tr>${trimmed.split("|").filter(Boolean).map((c) => `<td class="px-3 py-2 border border-border">${c.trim()}</td>`).join("")}</tr></table></div>`;
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return `<li class="text-text-secondary ml-4 mb-1">${trimmed.slice(2)}</li>`;
      if (/^\d+\.\s/.test(trimmed)) return `<li class="text-text-secondary ml-4 mb-1 list-decimal">${trimmed.replace(/^\d+\.\s/, "")}</li>`;
      if (trimmed.startsWith("[") && trimmed.includes("](")) {
        const match = trimmed.match(/\[(.+?)\]\((.+?)\)/);
        if (match) return `<p class="mt-4"><a href="${match[2]}" class="text-primary font-medium hover:underline">${match[1]}</a></p>`;
      }
      // Bold text
      const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>');
      return `<p class="text-text-secondary leading-relaxed mb-3">${withBold}</p>`;
    })
    .join("\n");

  // Get related posts (excluding current)
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getBlogPostingSchema({ title: post.title, description: post.excerpt, slug: post.slug, datePublished: post.date })} />
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: "https://www.covnantreality.com" }, { name: "Blog", url: "https://www.covnantreality.com/blog" }, { name: post.title, url: `https://www.covnantreality.com/blog/${post.slug}` }])} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-text-primary font-medium line-clamp-1">{post.title}</span>
        </nav>

        <article>
          <header className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-4 mb-4">{post.title}</h1>
            <p className="text-lg text-text-secondary mb-4">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readingTime}</span>
            </div>
          </header>

          <div className="border-t border-border pt-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group p-6 rounded-xl border border-border bg-bg-card hover:shadow-md transition-all">
                  <span className="text-xs font-semibold text-primary">{rp.category}</span>
                  <h3 className="font-bold text-text-primary mt-2 mb-2 group-hover:text-primary transition-colors">{rp.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2">{rp.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>

        <InternalLinksGrid />
      </div>
    </main>
  );
}
