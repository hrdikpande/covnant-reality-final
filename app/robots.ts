import type { MetadataRoute } from 'next'

const PRIVATE_PATHS = ['/admin/', '/agent/', '/builder/', '/owner/', '/dashboard/', '/api/', '/_next/', '/thank-you/']

export default function robots(): MetadataRoute.Robots {
  // Canonical host is non-www — www 301-redirects here. If NEXT_PUBLIC_BASE_URL
  // is set in the hosting environment, it must also be the non-www host.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://covnantreality.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // Explicit allow-list for AI search crawlers — same access as regular
      // search bots, so listings/blog content stays eligible for citation in
      // ChatGPT search, Perplexity, and Google AI Overviews/AI Mode.
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
