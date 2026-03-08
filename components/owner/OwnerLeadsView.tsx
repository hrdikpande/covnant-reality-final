import { useEffect, useState } from "react";
import { Search, Phone, User, Calendar } from "lucide-react";
import { getOwnerLeads, type OwnerLead } from "@/lib/supabase/owner";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/Input";

export function OwnerLeadsView() {
    const { user } = useAuth();
    const [leads, setLeads] = useState<OwnerLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchLeads = async () => {
            const data = await getOwnerLeads(user.id);
            setLeads(data);
            setIsLoading(false);
        };
        fetchLeads();
    }, [user]);

    const filteredLeads = leads.filter(l =>
        l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new":
                return "bg-blue-100 text-blue-700";
            case "contacted":
                return "bg-amber-100 text-amber-700";
            case "visited":
                return "bg-purple-100 text-purple-700";
            case "closed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-96">
                    <Input
                        type="text"
                        placeholder="Search leads by name or property..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-text-muted" />}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse"></div>)}
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">No leads found</h3>
                    <p className="text-text-secondary mt-1">
                        {searchQuery ? "Try adjusting your search query." : "You don't have any leads yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Lead Name</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Property</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {lead.name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <span className="font-semibold text-text-primary">
                                                    {lead.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {lead.phone || "No phone"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-text-primary font-medium line-clamp-1">
                                                {lead.property?.title || "Unknown Property"}
                                            </span>
                                            <span className="text-xs text-text-muted capitalize">
                                                Source: {lead.source || "web"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md ${getStatusBadge(lead.status)}`}>
                                                {lead.status || "new"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-muted text-sm flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(lead.created_at).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
