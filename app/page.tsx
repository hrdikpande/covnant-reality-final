import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, getRealEstateAgentSchema } from "@/components/seo/JsonLd";
import { HomeContent } from "./HomeContent";

export const metadata: Metadata = buildMetadata("home");

export default function HomePage() {
  return (
    <>
      <JsonLd data={getRealEstateAgentSchema()} />
      <HomeContent />
    </>
  );
}
