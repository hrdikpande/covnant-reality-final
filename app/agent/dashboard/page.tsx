import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AgentStatsCards } from "@/components/agent/dashboard/AgentStatsCards";
import { RecentLeadsTable } from "@/components/agent/dashboard/RecentLeadsTable";
import { UpcomingVisits } from "@/components/agent/dashboard/UpcomingVisits";
import { PipelineSummary } from "@/components/agent/dashboard/PipelineSummary";
import { PerformanceStats } from "@/components/agent/dashboard/PerformanceStats";
import { QuickActions } from "@/components/agent/dashboard/QuickActions";
import { Card, CardContent } from "@/components/ui/Card";

export default async function AgentDashboardNewPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
        redirect("/auth");
    }

    // Fetch agent profile for welcome header
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .single();

    const agentName = profile?.full_name || "Agent";

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            {/* SECTION 1 — Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">
                    Welcome back, {agentName}
                </h1>
                <p className="text-sm text-text-secondary mt-1">{today}</p>
            </div>

            {/* SECTION 2 — KPI SUMMARY CARDS */}
            <AgentStatsCards />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">

                {/* Left/Main Column */}
                <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">

                    {/* SECTION 3 — RECENT LEADS TABLE */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-primary">Recent Leads</h2>
                        </div>
                        <Card>
                            <CardContent className="p-0 overflow-hidden">
                                <RecentLeadsTable />
                            </CardContent>
                        </Card>
                    </section>

                    {/* SECTION 5 — SALES PIPELINE SUMMARY */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-primary">Sales Pipeline</h2>
                        </div>
                        <Card>
                            <CardContent className="p-5">
                                <PipelineSummary />
                            </CardContent>
                        </Card>
                    </section>

                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 md:gap-8">

                    {/* SECTION 7 — QUICK ACTIONS */}
                    <section>
                        <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
                        <QuickActions />
                    </section>

                    {/* SECTION 4 — UPCOMING SITE VISITS */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-primary">Upcoming Visits</h2>
                        </div>
                        <UpcomingVisits />
                    </section>

                    {/* SECTION 6 — PERFORMANCE SNAPSHOT */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-primary">Performance Snapshot</h2>
                        </div>
                        <PerformanceStats />
                    </section>

                </div>
            </div>
        </div>
    );
}
