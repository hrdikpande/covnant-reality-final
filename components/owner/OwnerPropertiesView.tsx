"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import { getOwnerProperties, type OwnerProperty } from "@/lib/supabase/owner";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/Input";

export function OwnerPropertiesView() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<OwnerProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchProperties = async () => {
            const data = await getOwnerProperties(user.id);
            setProperties(data);
            setIsLoading(false);
        };
        fetchProperties();
    }, [user]);

    const filteredProperties = properties.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-amber-100 text-amber-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "sold":
                return "bg-slate-100 text-slate-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const formatPrice = (price?: number) => {
        if (!price) return "N/A";
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-96">
                    <Input
                        type="text"
                        placeholder="Search properties by title or city..."
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
            ) : filteredProperties.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">No properties found</h3>
                    <p className="text-text-secondary mt-1">
                        {searchQuery ? "Try adjusting your search query." : "You haven't listed any properties yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Property</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Price</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary">Added</th>
                                    <th className="px-6 py-4 font-semibold text-text-secondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProperties.map((property) => (
                                    <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                                    {property.image ? (
                                                        <Image src={property.image} alt={property.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary line-clamp-1">{property.title}</p>
                                                    <p className="text-xs text-text-muted mt-0.5 capitalize">{property.property_type} • {property.listing_type} • {property.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">
                                            {formatPrice(property.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md ${getStatusBadge(property.status)}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-muted text-sm">
                                            {new Date(property.created_at).toLocaleDateString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-md transition-colors" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-text-secondary hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Property">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Property">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
