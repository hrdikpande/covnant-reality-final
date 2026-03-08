import { Metadata } from "next";
import { RoleGuard } from "@/components/RoleGuard";


export const metadata: Metadata = {
    title: "My Dashboard | Covnant Reality India PVT LTD",
    description:
        "Manage your saved properties, visits, alerts and bookings.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["buyer", "tenant"]}>
            <div className="flex min-h-screen bg-bg">
                {children}

                {/* Dashboard Footer — only visible when scrolled to bottom */}
            </div>
        </RoleGuard>
    );
}
