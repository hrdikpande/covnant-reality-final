"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SalesStatus = "Paid" | "Pending";

export interface SaleTransaction {
    id: string;
    agentName: string;
    agentEmail: string;
    planSold: string;
    commissionPercent: number;
    commission: number;
    date: string;
    status: SalesStatus;
}

interface AdminSalesTableProps {
    sales: SaleTransaction[];
}

const getStatusBadge = (status: SalesStatus) => {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700 pointer-events-none";
        case "Pending":
            return "bg-amber-100 text-amber-700 pointer-events-none";
        default:
            return "bg-slate-100 text-slate-700 pointer-events-none";
    }
};

const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
};

export function AdminSalesTable({ sales }: AdminSalesTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSales = sales.filter(s =>
        s.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.planSold.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white border border-border rounded-xl shadow-sm text-sm">

            {/* Search Bar inside table container */}
            <div className="p-4 border-b border-border">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by Agent or Plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-primary bg-white"
                    />
                </div>
            </div>

            {/* Mobile / Tablet View: Card Layout */}
            <div className="lg:hidden divide-y divide-border">
                {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                        <div key={sale.id} className="p-4 flex flex-col gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-text-primary text-base">{sale.agentName}</span>
                                    </div>
                                    <span className="text-xs text-text-muted">{sale.agentEmail}</span>
                                </div>
                                <span className={cn(
                                    "inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full shrink-0",
                                    getStatusBadge(sale.status)
                                )}>
                                    {sale.status}
                                </span>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                                    <div>
                                        <span className="text-text-muted block mb-0.5 font-medium">Plan Sold</span>
                                        <span className="text-text-primary px-2 py-0.5 rounded border border-slate-200 bg-white inline-block font-medium">
                                            {sale.planSold}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-text-muted block mb-0.5 font-medium">Commission %</span>
                                        <span className="text-text-primary font-medium">{sale.commissionPercent}%</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-text-muted block mb-0.5 font-medium">Commission Amount</span>
                                        <span className="text-green-600 font-bold">{formatCurrency(sale.commission)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-text-muted">
                        No specific records found matching your query.
                    </div>
                )}
            </div>

            {/* Desktop View: Table Layout */}
            <div className="hidden lg:block overflow-x-auto min-h-[400px] w-full pb-32">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-border">
                            <th className="px-6 py-4 font-semibold text-text-secondary whitespace-nowrap">Agent Name</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary whitespace-nowrap">Plan Sold</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary whitespace-nowrap text-center">Commission %</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary whitespace-nowrap text-right">Commission Amount</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary whitespace-nowrap text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredSales.length > 0 ? (
                            filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-text-primary text-sm">{sale.agentName}</span>
                                            <span className="text-text-muted text-xs mt-0.5">{sale.agentEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-text-primary bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">{sale.planSold}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-text-primary text-sm whitespace-nowrap text-center">
                                        {sale.commissionPercent}%
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-green-600 text-sm whitespace-nowrap text-right">
                                        {formatCurrency(sale.commission)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={cn(
                                            "inline-flex items-center justify-center px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md",
                                            getStatusBadge(sale.status)
                                        )}>
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                    No records found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
