import { NextResponse } from "next/server";
import { generateBlog } from "@/lib/blog/generator";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { properties, rawContent, keyword, tone } = body;

        if (!properties || !Array.isArray(properties)) {
            return NextResponse.json({ error: "Missing or invalid properties array" }, { status: 400 });
        }

        if (!keyword) {
            return NextResponse.json({ error: "Missing focus keyword" }, { status: 400 });
        }

        const blogData = generateBlog({
            properties,
            rawContent: rawContent || "",
            keyword,
            tone: tone || "Informative"
        });

        return NextResponse.json(blogData, { status: 200 });
    } catch (error: any) {
        console.error("Blog generation error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate blog" }, { status: 500 });
    }
}
