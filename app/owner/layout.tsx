import { Metadata } from "next";
import { RoleGuard } from "@/components/RoleGuard";

export const metadata: Metadata = {
    title: "Owner Dashboard | Covnant Reality India PVT LTD",
    description: "Manage your properties, leads, and site visits.",
    robots: { index: false, follow: false },
};

export default function OwnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["owner"]}>
            <div className="flex flex-col lg:flex-row min-h-screen bg-bg">
                {children}
            </div>
        </RoleGuard>
    );
}
