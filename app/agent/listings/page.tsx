import { Metadata } from "next";
import { PropertyManagementSection } from "@/components/agent/PropertyManagementSection";

export const metadata: Metadata = {
    title: "My Listings | Agent Panel — Covnant Reality India PVT LTD",
};

export default function AgentListingsPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <PropertyManagementSection />
        </div>
    );
}
