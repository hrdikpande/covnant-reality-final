import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { RoleGuard } from "@/components/RoleGuard";

export const metadata: Metadata = {
    title: "Builder Dashboard | Covnant Reality India PVT LTD",
    description: "Manage your projects and leads",
};

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["builder"]}>
            <div className="flex flex-col lg:flex-row min-h-screen bg-bg">
                <BuilderSidebar />
                <div className="flex-1 min-w-0 flex flex-col">
                    <Container className="py-6 sm:py-8 lg:py-10 flex-1">
                        {children}
                    </Container>

                    {/* Global Footer matched from Agent Layout */}
                    <footer className="border-t border-border bg-white mt-auto">
                        <Container className="py-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-secondary">
                                <span>© {new Date().getFullYear()} Covnant Reality India PVT LTD. All rights reserved.</span>
                                <div className="flex items-center gap-4">
                                    <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                                    <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
                                    <a href="/support" className="hover:text-primary transition-colors">Support</a>
                                </div>
                            </div>
                        </Container>
                    </footer>
                </div>
            </div>
        </RoleGuard>
    );
}
