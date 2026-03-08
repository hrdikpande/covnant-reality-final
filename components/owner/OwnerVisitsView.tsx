"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, Clock, MapPin, User, Check, X } from "lucide-react";
import { getOwnerVisits, type OwnerVisit } from "@/lib/supabase/owner";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export function OwnerVisitsView() {
    const { user } = useAuth();
    const [visits, setVisits] = useState<OwnerVisit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchVisits = async () => {
            const data = await getOwnerVisits(user.id);
            setVisits(data);
            setIsLoading(false);
        };
        fetchVisits();
    }, [user]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("site_visits")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        }
    };

    const filteredVisits = visits.filter(v =>
        v.buyer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "requested":
                return "bg-amber-100 text-amber-700";
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
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
                        placeholder="Search visits by buyer or property..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-text-muted" />}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>)}
                </div>
            ) : filteredVisits.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">No site visits found</h3>
                    <p className="text-text-secondary mt-1">
                        {searchQuery ? "Try adjusting your search query." : "You don't have any requested site visits yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Visitor</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Property</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Scheduled For</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredVisits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary">
                                                        {visit.buyer?.full_name || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-text-muted">
                                                        {visit.buyer?.phone || "No phone"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin className="w-4 h-4 mt-0.5 text-text-muted shrink-0" />
                                                <span className="text-text-primary font-medium line-clamp-2">
                                                    {visit.property?.title || "Unknown Property"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-text-primary font-medium">
                                                    <Calendar className="w-4 h-4 text-text-muted" />
                                                    {new Date(visit.visit_date).toLocaleDateString("en-IN")}
                                                </div>
                                                <div className="flex items-center gap-2 text-text-secondary text-sm">
                                                    <Clock className="w-4 h-4 text-text-muted" />
                                                    {visit.visit_time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md ${getStatusBadge(visit.status)}`}>
                                                {visit.status || "requested"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {visit.status === "requested" && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(visit.id, "confirmed")}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                        title="Confirm Visit"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(visit.id, "cancelled")}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Cancel Visit"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                            {visit.status === "confirmed" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(visit.id, "completed")}
                                                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                                                >
                                                    Mark Completed
                                                </button>
                                            )}
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
