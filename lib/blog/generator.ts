import { Property } from "@/types";

export interface GenerateBlogParams {
    properties: Property[];
    rawContent: string;
    keyword: string;
    tone: string;
}

export interface GeneratedBlog {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    excerpt: string;
    keywords: string[];
    wordCount: number;
    readingTime: number;
    seoScore: number;
    schemaMarkup: any;
}

/**
 * Strips HTML tags to count words and get plain text.
 */
function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, '');
}

/**
 * Calculates a basic SEO score out of 100 based on standard metrics.
 */
function calculateSeoScore(
    title: string,
    metaDesc: string,
    keyword: string,
    wordCount: number,
    hasLinks: boolean,
    hasImages: boolean,
    hasOgImage: boolean
): number {
    let score = 0;
    
    // Title length (50-60 is ideal)
    if (title.length >= 50 && title.length <= 60) score += 15;
    else if (title.length > 0) score += 10;

    // Meta description length (120-160 is ideal)
    if (metaDesc.length >= 120 && metaDesc.length <= 160) score += 15;
    else if (metaDesc.length > 0) score += 10;

    // Keyword in title
    if (title.toLowerCase().includes(keyword.toLowerCase())) score += 15;

    // Word count (>800 is ideal)
    if (wordCount >= 800) score += 20;
    else if (wordCount >= 500) score += 10;
    else if (wordCount > 0) score += 5;

    // Has property links
    if (hasLinks) score += 15;

    // Has images with alt text (simulated for initial generation score)
    if (hasImages) score += 10;
    if (hasOgImage) score += 10;

    return Math.min(100, score);
}

/**
 * Converts a string to a URL-friendly slug
 */
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export function generateBlog({ properties, rawContent, keyword, tone }: GenerateBlogParams): GeneratedBlog {
    // 1. Basic properties info
    const cities = [...new Set(properties.map(p => p.city))].filter(Boolean);
    const mainCity = cities[0] || "the city";
    const types = [...new Set(properties.map(p => p.type))];
    const mainType = types[0] || "properties";

    // 2. Generate Title
    let title = `Best ${mainType.charAt(0).toUpperCase() + mainType.slice(1)}s in ${mainCity}: Top Picks for You`;
    if (properties.length === 1) {
        title = `Inside ${properties[0].title} — The Best ${mainType} in ${mainCity}`;
    }

    // 3. Generate Slug
    const slug = generateSlug(title);

    // 4. Content Building (Template Engine)
    let contentHtml = `<h1>${title}</h1>\n\n`;

    // Intro paragraph
    contentHtml += `<p>If you're looking for the perfect real estate investment, the <strong>${keyword}</strong> market in ${mainCity} is currently thriving. Whether you are a first-time buyer or a seasoned investor, finding the right property can be challenging. In this guide, we break down some of the best options available.</p>\n\n`;

    // Body content (incorporating raw notes)
    if (rawContent && rawContent.trim().length > 0) {
        contentHtml += `<h2>Expert Insights on ${mainCity} Real Estate</h2>\n`;
        const rawParagraphs = rawContent.split('\n').filter(p => p.trim().length > 0);
        rawParagraphs.forEach(p => {
            contentHtml += `<p>${p}</p>\n`;
        });
        contentHtml += `\n`;
    } else {
        contentHtml += `<h2>Why ${mainCity} is a Great Place to Invest</h2>\n`;
        contentHtml += `<p>${mainCity} has seen tremendous growth in infrastructure and connectivity, making it a prime location for real estate investment. With a booming IT sector and improved public transport, property values have been steadily rising.</p>\n\n`;
    }

    // Featured Properties Section with Backlinks
    if (properties.length > 0) {
        contentHtml += `<h2>Featured Properties</h2>\n`;
        properties.forEach(prop => {
            const propUrl = \`/property/\${prop.slug || prop.id}\`;
            contentHtml += `<h3>${prop.title}</h3>\n`;
            contentHtml += `<p>Located in ${prop.locality || prop.city}, this stunning ${prop.type} is an exceptional opportunity. You can explore more details about <a href="\${propUrl}">${prop.title}</a> right now.</p>\n`;
            if (prop.price > 0) {
                contentHtml += `<p>Priced at ₹${prop.price.toLocaleString('en-IN')}, it offers excellent value.</p>\n`;
            }
            contentHtml += `\n`;
        });
    }

    // Conclusion
    contentHtml += `<h2>Final Thoughts</h2>\n`;
    contentHtml += `<p>Investing in ${mainCity} real estate is a solid choice for ${new Date().getFullYear()}. Make sure to review your options and consult with experts to find the home that perfectly suits your needs. Ready to take the next step? Contact us today to schedule a site visit.</p>\n`;

    // 5. Generate Meta Data
    const plainText = stripHtml(contentHtml);
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute

    // Meta Title (Max 60 chars)
    let metaTitle = `${title}`.substring(0, 60);
    
    // Meta Description (Max 160 chars)
    let metaDescription = `Discover the best ${keyword}. Read our expert guide featuring top properties in ${mainCity} with detailed insights for buyers.`.substring(0, 160);

    // Excerpt (first 150 chars of plain text)
    const excerpt = plainText.substring(0, 150) + '...';

    // Keywords
    const keywords = [keyword, ...cities, ...types, "real estate", "investment"];

    // SEO Score calculation (initially no OG image, so false for those flags)
    const seoScore = calculateSeoScore(
        metaTitle, 
        metaDescription, 
        keyword, 
        wordCount, 
        properties.length > 0, 
        false, // images
        false  // og image
    );

    // 6. Generate JSON-LD Schema
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": metaTitle,
        "description": metaDescription,
        "datePublished": new Date().toISOString(),
        "author": { 
            "@type": "Organization", 
            "name": "Covnant Reality India PVT LTD" 
        },
        "keywords": keywords.join(", "),
        "mentions": properties.map(p => ({
            "@type": p.type === "commercial" ? "CommercialEvent" : "Residence",
            "name": p.title,
            "url": `https://www.covnantreality.com/property/${p.slug || p.id}`
        }))
    };

    return {
        title,
        slug,
        metaTitle,
        metaDescription,
        content: contentHtml,
        excerpt,
        keywords,
        wordCount,
        readingTime,
        seoScore,
        schemaMarkup
    };
}
