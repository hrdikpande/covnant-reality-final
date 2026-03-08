"use client";

import { useState, useEffect } from "react";
import { Star, UserCircle2, X, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { fetchPropertyReviews, submitPropertyReview } from "@/lib/supabase/reviews";
import type { PropertyReview } from "@/types";
import { useRouter, usePathname } from "next/navigation";

export function ReviewsSection({ propertyId }: { propertyId: string }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<PropertyReview[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;
        const loadReviews = async () => {
            if (!propertyId) return;
            setLoading(true);
            const data = await fetchPropertyReviews(propertyId);
            if (mounted) {
                setReviews(data);
                setLoading(false);
            }
        };

        loadReviews();
        return () => { mounted = false; };
    }, [propertyId]);

    const handleOpenModal = () => {
        if (!user) {
            const searchParams = new window.URLSearchParams(window.location.search);
            const qs = searchParams.toString();
            const currentPath = pathname + (qs ? `?${qs}` : "");
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }
        setIsModalOpen(true);
        setErrorMsg("");
    };

    const handleSubmit = async () => {
        if (!user) return;
        setSubmitting(true);
        setErrorMsg("");

        const result = await submitPropertyReview(propertyId, user.id, rating, comment);
        if (result.success) {
            setIsModalOpen(false);
            setRating(5);
            setComment("");

            // Re-fetch data manually upon submission since loadReviews is in effect
            setLoading(true);
            const data = await fetchPropertyReviews(propertyId);
            setReviews(data);
            setLoading(false);
        } else {
            setErrorMsg(result.error || "Failed to submit review");
        }
        setSubmitting(false);
    };

    // Calculate Average
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Reviews</h3>
                    {averageRating && (
                        <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-text-primary text-sm">{averageRating}</span>
                            <span className="text-text-muted text-xs">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleOpenModal}
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
                </div>
            ) : reviews.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-8 bg-bg border border-border rounded-xl text-center gap-3">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 text-border" />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-text-primary">No reviews yet</p>
                    <p className="text-xs text-text-muted max-w-[220px]">
                        Be the first to share your experience with this property.
                    </p>
                    <button
                        onClick={handleOpenModal}
                        className="mt-1 px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
                    >
                        Write a Review
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-4 border border-border rounded-xl bg-bg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <UserCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{review.user_name || "User"}</p>
                                        <p className="text-xs text-text-muted">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-text-secondary mt-3">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-bold text-text-primary">Write a Review</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-bg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 space-y-5">
                            {/* Star Selection */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-medium text-text-secondary">Tap a star to rate</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((starValue) => (
                                        <button
                                            key={starValue}
                                            type="button"
                                            onClick={() => setRating(starValue)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${starValue <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1">
                                    Your Experience (Optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others what you liked or disliked..."
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted resize-none h-28"
                                />
                            </div>

                            {errorMsg && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
