"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor, getReviewsForVendor, addVendorReviewReply } from "@/lib/vendorStore";
import { ReviewItem } from "@/lib/mockData";
import { Star, MessageSquare, CheckCircle2, ShieldCheck, Heart, Reply, Send, Sparkles } from "lucide-react";

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [replySuccessMap, setReplySuccessMap] = useState<Record<string, boolean>>({});

  const vendor = getCurrentVendor();

  useEffect(() => {
    setReviews(getReviewsForVendor(vendor.id));
  }, [vendor.id]);

  const handleSendReply = (reviewId: string) => {
    const text = replyInputMap[reviewId];
    if (!text?.trim()) return;

    addVendorReviewReply(reviewId, text.trim());
    setReviews(getReviewsForVendor(vendor.id));
    setReplySuccessMap({ ...replySuccessMap, [reviewId]: true });
    setReplyInputMap({ ...replyInputMap, [reviewId]: "" });
  };

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Reviews, Ratings & Reputation ({reviews.length})
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Verified client testimonials, sentiment breakdown, and direct partner replies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#641E3D] px-3 py-1.5 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF]">
              <Star className="size-3.5 fill-[#D2AD6B] text-[#D2AD6B]" /> {vendor.rating} Out of 5.0 Rating
            </span>
          </div>
        </div>

        {/* ──── RATING BREAKDOWN + REVIEWS LIST ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rating Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2A121E]">Rating Distribution</h3>

            <div className="text-center py-4 bg-[#FAF5EC] rounded-xl border border-[#EFE3CF]">
              <div className="text-4xl font-serif font-bold text-[#641E3D]">{vendor.rating}</div>
              <div className="flex items-center justify-center gap-1 my-1 text-[#D2AD6B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-[#D2AD6B]" />
                ))}
              </div>
              <p className="text-[10px] text-[#786B70] font-bold uppercase tracking-wider">
                Based on {vendor.reviewsCount} Verified Bookings
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-[#2A121E]">5 ★</span>
                <div className="flex-1 h-2 bg-[#FAF5EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D2AD6B] w-[92%]" />
                </div>
                <span className="w-8 text-right text-[#786B70]">92%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-[#2A121E]">4 ★</span>
                <div className="flex-1 h-2 bg-[#FAF5EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D2AD6B] w-[8%]" />
                </div>
                <span className="w-8 text-right text-[#786B70]">8%</span>
              </div>
            </div>
          </div>

          {/* Reviews List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2A121E]">{rev.customerName}</h4>
                    <p className="text-[10px] text-[#786B70]">{rev.eventType} • {rev.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#D2AD6B]">
                    {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                      <Star key={i} className="size-3 fill-[#D2AD6B]" />
                    ))}
                    <span className="text-xs font-bold text-[#2A121E] ml-1">{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-[#4A3B40] leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Existing Reply */}
                {rev.vendorReply ? (
                  <div className="p-3 bg-[#FAF5EC] border-l-2 border-[#641E3D] rounded-r-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#641E3D]">
                      <span>Your Atelier Response</span>
                      <span className="text-[#8A7A70]">{rev.vendorReply.repliedAt}</span>
                    </div>
                    <p className="text-[11px] text-[#2A121E]">{rev.vendorReply.replyText}</p>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#F7EFE4] space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyInputMap[rev.id] || ""}
                        onChange={(e) => setReplyInputMap({ ...replyInputMap, [rev.id]: e.target.value })}
                        placeholder="Write a graceful thank-you or response to this client..."
                        className="flex-1 px-3 py-1.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(rev.id)}
                        className="px-3 py-1.5 bg-[#641E3D] text-white text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Send className="size-3" /> Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
