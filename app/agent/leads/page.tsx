import { Metadata } from "next";
import { LeadManagementSection } from "@/components/agent/LeadManagementSection";

export const metadata: Metadata = {
    title: "Leads | Agent Panel — Covnant Reality India PVT LTD",
};

export default function AgentLeadsPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <LeadManagementSection />
        </div>
    );
}
