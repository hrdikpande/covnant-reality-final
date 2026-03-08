import type { Metadata } from "next";
import { Suspense } from "react";
import { PostPropertyContent } from "./PostPropertyContent";

export const metadata: Metadata = {
    title: "Post Property | Covnant Reality India PVT LTD",
    description: "Post your property on Covnant Reality India PVT LTD",
};

export default function PostPropertyPage() {
    return (
        <Suspense fallback={null}>
            <PostPropertyContent />
        </Suspense>
    );
}
