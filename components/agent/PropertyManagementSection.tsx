"use client";

import { useState, useEffect, useCallback } from "react";
import { ListFilter, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentListingCard } from "@/components/agent/AgentListingCard";
import {
  fetchAgentListings,
  type AgentListingRow,
} from "@/lib/supabase/agent-dashboard";

export function PropertyManagementSection() {
  const [listings, setListings] = useState<AgentListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgentListings();
      setListings(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load listings";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // ─── Filtering & Sorting ──────────────────────────────────

  const filteredListings = listings
    .filter((l) => statusFilter === "all" || l.status === statusFilter)
    .sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

  return (
    <section className="px-4 sm:px-0 flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <h2 className="text-xl font-bold text-text-primary">
          My Assigned Listings
        </h2>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filters & Sort Group */}
          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ListFilter className="w-4 h-4 text-text-secondary" />
              </div>
              <select
                className="w-full sm:w-auto appearance-none bg-white border border-border rounded-xl h-10 pl-9 pr-10 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowUpDown className="w-4 h-4 text-text-secondary" />
              </div>
              <select
                className="w-full sm:w-auto appearance-none bg-white border border-border rounded-xl h-10 pl-9 pr-10 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "newest" | "oldest")
                }
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-border rounded-2xl text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <span className="text-sm text-text-secondary">
            Loading your listings…
          </span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 border border-red-200 rounded-2xl text-center">
          <h3 className="text-lg font-bold text-red-700 mb-1">
            Failed to load listings
          </h3>
          <p className="text-sm text-red-600 mb-4 max-w-sm">{error}</p>
          <Button variant="outline" onClick={loadListings}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredListings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-border rounded-2xl text-center">
          <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
            <ListFilter className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {statusFilter !== "all"
              ? "No listings match this filter"
              : "No assigned listings found"}
          </h3>
          <p className="text-sm text-text-secondary mb-4 max-w-sm">
            {statusFilter !== "all"
              ? "Try changing the filter to see more results."
              : "You don't have any listings assigned to you yet."}
          </p>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && !error && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredListings.map((listing) => (
            <AgentListingCard
              key={listing.id}
              listing={listing}
              onMutated={loadListings}
            />
          ))}
        </div>
      )}
    </section>
  );
}
