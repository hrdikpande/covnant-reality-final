import { Metadata } from "next";
import { AgentProfileSettings } from "@/components/agent/AgentProfileSettings";

export const metadata: Metadata = {
    title: "Profile Settings | Agent Panel — Covnant Reality India PVT LTD",
};

export default function AgentProfilePage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h1 className="text-2xl font-bold text-text-primary px-4 sm:px-0">Profile Settings</h1>

            <div className="px-4 sm:px-0">
                <AgentProfileSettings />
            </div>
        </div>
    );
}
