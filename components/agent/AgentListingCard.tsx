"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Eye,
  Users,
  Edit2,
  Copy,
  CheckCircle,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  deleteProperty,
  updatePropertyStatus,
  cloneProperty,
  type AgentListingRow,
} from "@/lib/supabase/agent-dashboard";

interface AgentListingCardProps {
  listing: AgentListingRow;
  onMutated?: () => void; // callback to refresh the parent list
}

export function AgentListingCard({
  listing,
  onMutated,
}: AgentListingCardProps) {
  const router = useRouter();
  const [cloning, setCloning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [markingSold, setMarkingSold] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusLabel =
    listing.status === "approved"
      ? "Active"
      : listing.status === "sold"
        ? "Sold"
        : listing.status === "rented"
          ? "Rented"
          : listing.status === "pending"
            ? "Pending"
            : "Draft";

  const statusVariant =
    statusLabel === "Active"
      ? "success"
      : statusLabel === "Sold" || statusLabel === "Rented"
        ? "default"
        : "warning";

  const imageUrl =
    listing.property_media?.[0]?.media_url ?? "/placeholder-property.jpg";

  // ─── Handlers ────────────────────────────────────────

  const handleEdit = () => {
    router.push(`/post-property?edit=${listing.id}`);
  };

  const handleClone = async () => {
    if (cloning) return;
    setCloning(true);
    const result = await cloneProperty(listing.id);
    setCloning(false);
    if (result.success) {
      onMutated?.();
    } else {
      alert(result.error ?? "Failed to clone property.");
    }
  };

  const handleMarkSold = async () => {
    if (markingSold) return;
    setMarkingSold(true);
    const newStatus = listing.listing_type === "rent" ? "rented" : "sold";
    const result = await updatePropertyStatus(listing.id, newStatus);
    setMarkingSold(false);
    if (result.success) {
      onMutated?.();
    } else {
      alert(result.error ?? "Failed to update property status.");
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    const result = await deleteProperty(listing.id);
    setDeleting(false);
    setShowDeleteConfirm(false);
    if (result.success) {
      onMutated?.();
    } else {
      alert(result.error ?? "Failed to delete property.");
    }
  };

  const isSoldOrRented =
    listing.status === "sold" || listing.status === "rented";

  return (
    <>
      <Card className={`overflow-hidden flex flex-col h-full`}>
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Image — always on top */}
          <div className="relative w-full h-48 shrink-0">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
            />
            {/* Status badge overlaid on image */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 gap-3">
            {/* Price + Title */}
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-primary">
                ₹{Number(listing.price).toLocaleString("en-IN")}
              </span>
              <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1.5 text-text-secondary text-xs mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {listing.address}, {listing.city}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <span className="font-semibold text-text-primary">
                    {listing.views_count}
                  </span>{" "}
                  Views
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <span className="font-semibold text-text-primary">
                    {listing.leads_count}
                  </span>{" "}
                  Leads
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={
                    cloning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  className="w-full text-xs"
                  onClick={handleClone}
                  disabled={cloning}
                >
                  {cloning ? "…" : "Clone"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={
                    markingSold ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    )
                  }
                  className="w-full text-xs text-text-secondary"
                  onClick={handleMarkSold}
                  disabled={isSoldOrRented || markingSold}
                >
                  {markingSold
                    ? "…"
                    : isSoldOrRented
                      ? statusLabel
                      : listing.listing_type === "rent"
                        ? "Mark Rented"
                        : "Mark Sold"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Delete Listing
                </h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Are you sure you want to delete{" "}
                  <strong>&quot;{listing.title}&quot;</strong>? This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
