import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { JsonLd, getBreadcrumbSchema, getBlogPostingSchema } from "@/components/seo/JsonLd";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { BASE_URL } from "@/lib/seo/metadata";

export const revalidate = 60; // Revalidate every 60 seconds for fast loads

async function getBlogData(slug: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) return null;

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch blog
    const { data: blog, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (blogError || !blog) return null;

    // Fetch linked properties
    const { data: bpData } = await supabase
        .from("blog_properties")
        .select("property_id")
        .eq("blog_id", blog.id);

    let properties: any[] = [];
    if (bpData && bpData.length > 0) {
        const propertyIds = bpData.map(bp => bp.property_id);
        const { data: propData } = await supabase
            .from("properties")
            .select("*, property_media(media_url, media_type)")
            .in("id", propertyIds);
            
        const getPublicUrl = (path: string) => {
            if (!path) return "";
            if (path.startsWith("http") || path.startsWith("/")) return path;
            const { data } = supabase.storage.from("property-media").getPublicUrl(path);
            return data.publicUrl;
        };

        if (propData) {
            properties = propData.map((p: any) => ({
                ...p,
                image: p.property_media?.[0]?.media_url ? getPublicUrl(p.property_media[0].media_url) : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
                images: p.property_media?.map((m: any) => getPublicUrl(m.media_url)) || []
            }));
        }
    }

    return { blog, properties };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getBlogData(slug);
    
    if (!data) {
        return {
            title: "Blog Post Not Found | Covnant Reality",
            description: "The blog post you are looking for does not exist."
        };
    }

    const { blog } = data;

    return {
        title: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt,
        keywords: blog.keywords || [],
        openGraph: {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || blog.excerpt,
            url: `${BASE_URL}/blog/${blog.slug}`,
            type: "article",
            publishedTime: blog.published_at || blog.created_at,
            images: blog.og_image ? [{ url: blog.og_image }] : [],
        },
        alternates: {
            canonical: `${BASE_URL}/blog/${blog.slug}`
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getBlogData(slug);

    if (!data) {
        notFound();
    }

    const { blog, properties } = data;

    return (
        <main className="bg-bg min-h-screen">
            {/* Breadcrumb Schema */}
            <JsonLd data={getBreadcrumbSchema([
                { name: "Home", url: BASE_URL },
                { name: "Blog", url: `${BASE_URL}/blog` },
                { name: blog.title, url: `${BASE_URL}/blog/${blog.slug}` }
            ])} />

            {/* Blog Schema — use CMS-authored schema when present, otherwise fall back
                to a generated BlogPosting schema so every post carries structured data */}
            {blog.schema_markup ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.schema_markup) }}
                />
            ) : (
                <JsonLd
                    data={getBlogPostingSchema({
                        title: blog.title,
                        description: blog.meta_description || blog.excerpt || "",
                        slug: blog.slug,
                        datePublished: blog.published_at || blog.created_at,
                        dateModified: blog.updated_at,
                        imageUrl: blog.og_image || undefined,
                    })}
                />
            )}

            {/* Header Section */}
            <section className="bg-gradient-to-br from-primary/5 via-bg to-accent/5 pt-16 pb-12 border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm text-text-muted mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-text-primary font-medium line-clamp-1">{blog.title}</span>
                    </nav>

                    <div className="mb-8">
                        {blog.focus_keyword && (
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                                {blog.focus_keyword}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight mb-6">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary border-t border-border pt-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" />
                                <span>{blog.reading_time || 5} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* OG Image Cover */}
                {blog.og_image && (
                    <div className="w-full aspect-[21/9] bg-slate-100 rounded-2xl overflow-hidden mb-12 shadow-sm border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blog.og_image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Main Content */}
                <div 
                    className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-text-primary 
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 
                        prose-h3:text-xl prose-h3:mt-8 
                        prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-li:text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>

            {/* Featured Properties Section */}
            {properties.length > 0 && (
                <section className="bg-bg-card border-t border-border py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">Properties Featured in This Article</h2>
                            <p className="text-text-secondary">Explore the listings mentioned above in detail</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {properties.map((property: any) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
