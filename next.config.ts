import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // 1. Static Pages (Legacy WP to Next.js)
      { source: "/frequently-asked-questions/", destination: "/faq", permanent: true },
      { source: "/terms-and-conditions/", destination: "/terms", permanent: true },
      { source: "/contact/", destination: "/contact", permanent: true },
      { source: "/blog/", destination: "/blog", permanent: true },
      
      // 2. Functional Pages
      { source: "/create-listing/", destination: "/post-property", permanent: true },
      { source: "/favorite-properties/", destination: "/dashboard", permanent: true },
      { source: "/search-results/", destination: "/search", permanent: true },
      { source: "/agencies/", destination: "/search", permanent: true },
      { source: "/agent/", destination: "/search", permanent: true },
      { source: "/agents-2/", destination: "/search", permanent: true },
      { source: "/inquiry-form/", destination: "/contact", permanent: true },

      // 3. WP Property to Next.js Property
      { source: "/property/:slug/", destination: "/property/:slug", permanent: true },

      // 4. WP Blog Posts to Next.js Blog Posts
      { source: "/10-quick-tips-about-business-development/", destination: "/blog/10-quick-tips-about-business-development", permanent: true },
      { source: "/10-quick-tips-about-real-estate/", destination: "/blog/10-quick-tips-about-real-estate", permanent: true },
      { source: "/10-things-your-competitors-can-teach-you-about-real-estate/", destination: "/blog/10-things-your-competitors-can-teach-you-about-real-estate", permanent: true },
      { source: "/14-common-misconceptions-about-business-development/", destination: "/blog/14-common-misconceptions-about-business-development", permanent: true },
      { source: "/15-best-blogs-to-follow-about-real-estate/", destination: "/blog/15-best-blogs-to-follow-about-real-estate", permanent: true },
      { source: "/learn-the-truth-about-real-estate-industry/", destination: "/blog/learn-the-truth-about-real-estate-industry", permanent: true },
      { source: "/real-estate-industry-and-competitors/", destination: "/blog/real-estate-industry-and-competitors", permanent: true },
      { source: "/skills-that-you-can-learn-in-the-real-estate-market/", destination: "/blog/skills-that-you-can-learn-in-the-real-estate-market", permanent: true },
      { source: "/the-history-of-real-estate/", destination: "/blog/the-history-of-real-estate", permanent: true },
      { source: "/the-ultimate-cheat-sheet-on-real-estate/", destination: "/blog/the-ultimate-cheat-sheet-on-real-estate", permanent: true },
      { source: "/understand-the-real-estate-market/", destination: "/blog/understand-the-real-estate-market", permanent: true },
      { source: "/why-we-love-real-estate/", destination: "/blog/why-we-love-real-estate", permanent: true },
      { source: "/hello-world/", destination: "/blog", permanent: true },

      // 5. WP Taxonomy (Categories, Tags, Authors) -> Fallback to Blog Index
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/author/:path*", destination: "/blog", permanent: true },
      { source: "/2016/:path*", destination: "/blog", permanent: true },
      
      // 6. RSS & Comments
      { source: "/comments/feed/", destination: "/blog", permanent: true },
      { source: "/:path*/feed/", destination: "/blog", permanent: true },

      // 7. WP Junk / Theme Specific
      { source: "/grid-default/", destination: "/search", permanent: true },
      { source: "/grid-full-width-2-cols/", destination: "/search", permanent: true },
      { source: "/grid-full-width-4-cols/", destination: "/search", permanent: true },
      { source: "/grid-full-width/:path*", destination: "/search", permanent: true },
      { source: "/list-layout-full-width/", destination: "/search", permanent: true },
      { source: "/with-content-top/", destination: "/search", permanent: true },
      { source: "/with-featured-on-top/", destination: "/search", permanent: true },
      { source: "/with-half-map/", destination: "/search", permanent: true },
      { source: "/with-header-map/", destination: "/search", permanent: true },
      { source: "/with-list-layout/:path*", destination: "/search", permanent: true },
      { source: "/with-tabs/", destination: "/search", permanent: true },
      { source: "/listings-with-elementor/", destination: "/search", permanent: true },
      { source: "/status/for-sale/", destination: "/search?status=for-sale", permanent: true },
      
      // 8. Order / Payment System (Old)
      { source: "/complete-order/", destination: "/dashboard", permanent: true },
      { source: "/invoice/:path*", destination: "/dashboard", permanent: true },
      
      // 9. Misc
      { source: "/lander", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
};

export default nextConfig;
