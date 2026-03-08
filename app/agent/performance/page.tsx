import { Metadata } from "next";
import { PerformanceSection } from "@/components/agent/PerformanceSection";

export const metadata: Metadata = {
    title: "Performance | Agent Panel — Covnant Reality India PVT LTD",
};

export default function AgentPerformancePage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <PerformanceSection />
        </div>
    );
}
