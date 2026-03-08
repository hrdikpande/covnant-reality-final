import { AgentDashboardSidebar } from "@/components/agent/AgentDashboardSidebar";
import { Container } from "@/components/layout/Container";
import { RoleGuard } from "@/components/RoleGuard";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={["agent"]}>
            <div className="flex min-h-screen">
                <AgentDashboardSidebar />
                <div className="flex-1 min-w-0 bg-bg flex flex-col">
                    <Container className="py-6 sm:py-8 lg:py-10 flex-1">
                        {children}
                    </Container>

                    {/* Agent Footer */}
                    <footer className="border-t border-border bg-white">
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
