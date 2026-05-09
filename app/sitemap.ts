import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600; // revalidate the sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.covnantreality.com'
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Provide fallback empty string if env vars are missing to avoid errors during build/dev
  const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseKey || 'placeholder',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )

  let properties: any[] = []
  let blogs: any[] = []

  // Only fetch if we have valid supabase credentials
  if (supabaseUrl && supabaseKey) {
    const { data, error } = await supabase
      .from('properties')
      .select('id, created_at')
      .eq('status', 'approved')
      
      if (error) {
      console.error('Error fetching properties for sitemap:', error)
    } else if (data) {
      properties = data
    }

    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')

    if (blogError) {
      console.error('Error fetching blogs for sitemap:', blogError)
    } else if (blogData) {
      blogs = blogData
    }
  }

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/property/${property.slug || property.id}`,
    lastModified: new Date(property.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.published_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // ─── Static Routes ──────────────────────────────────────────────────────
  const routes: MetadataRoute.Sitemap = [
    // Homepage — highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    // ─── SEO Landing Pages (high priority) ────────────────────────────────
    {
      url: `${baseUrl}/commercial-property-hyderabad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/residential-properties-hyderabad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/warehouse-hyderabad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/plots-land-hyderabad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/property-management-hyderabad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ─── Blog ─────────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // ─── Standard Pages ───────────────────────────────────────────────────
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...routes, ...propertyEntries, ...blogEntries]
}
