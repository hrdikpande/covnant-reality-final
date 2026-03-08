import { Metadata } from "next";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RoleGuard } from "@/components/RoleGuard";

export const metadata: Metadata = {
    title: "Admin Panel | Covnant Reality India PVT LTD",
    description: "Admin dashboard for managing properties and users.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={["admin"]}>
            <AdminLayout>{children}</AdminLayout>
        </RoleGuard>
    );
}
