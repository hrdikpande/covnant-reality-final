import { Metadata } from "next";
import { BuilderProfileSettings } from "@/components/builder/BuilderProfileSettings";

export const metadata: Metadata = {
    title: "Profile Settings | Builder Panel — Covnant Reality India PVT LTD",
};

export default function BuilderProfilePage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h1 className="text-2xl font-bold text-text-primary px-4 sm:px-0">Profile Settings</h1>

            <div className="px-4 sm:px-0">
                <BuilderProfileSettings />
            </div>
        </div>
    );
}
