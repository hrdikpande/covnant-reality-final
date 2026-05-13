import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Blog } from "@/types";

export const revalidate = 60; // Revalidate every 60 seconds for fast loads

export const metadata: Metadata = buildMetadata("blog");

async function getBlogs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("blogs")
    .select("*, blog_properties(count)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
  return data;
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: "https://www.covnantreality.com" }, { name: "Blog", url: "https://www.covnantreality.com/blog" }])} />

      <section className="bg-gradient-to-br from-primary/5 via-bg to-accent/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-text-primary font-medium">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Real Estate Blog</h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
            Expert insights on Hyderabad real estate &mdash; commercial property trends, residential market updates, warehouse investments, and property buying guides.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length === 0 ? (
            <p className="text-text-muted">No published blogs found.</p>
          ) : (
            blogs.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                    {post.og_image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.og_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {post.focus_keyword || "Real Estate"}
                        </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at || post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time || 5} min read</span>
                      </div>
                      <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
