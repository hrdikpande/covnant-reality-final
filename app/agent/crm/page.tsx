import { Metadata } from "next";
import { FollowUpSection } from "@/components/agent/FollowUpSection";
import { CommissionTrackingSection } from "@/components/agent/CommissionTrackingSection";

export const metadata: Metadata = {
    title: "CRM | Agent Panel — Covnant Reality India PVT LTD",
};

export default function AgentCrmPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h1 className="text-2xl font-bold text-text-primary px-4 sm:px-0">CRM</h1>

            {/* Desktop: Commission takes 2 cols, Follow-ups takes 1 col */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                    <CommissionTrackingSection />
                </div>
                <div>
                    <FollowUpSection />
                </div>
            </div>
        </div>
    );
}
