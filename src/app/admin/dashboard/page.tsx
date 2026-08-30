"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllVendors, getAllInquiries } from "@/lib/vendorStore";
import { VendorAccount, InquiryItem } from "@/lib/mockData";
import { 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  IndianRupee, 
  TrendingUp, 
  Sparkles, 
  Store, 
  ArrowUpRight, 
  MessageSquareText,
  ChevronRight,
  Award
} from "lucide-react";

export default function AdminDashboard() {
  const [vendors, setVendors] = useState<VendorAccount[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  useEffect(() => {
    setVendors(getAllVendors());
    setInquiries(getAllInquiries());
  }, []);

  const totalGMV = inquiries.reduce((acc, i) => acc + (i.budget || 0), 0);
  const pendingVendors = vendors.filter((v) => v.status === "PENDING");
  const verifiedVendors = vendors.filter((v) => v.status === "VERIFIED");

  const statsCards = [
    {
      label: "Platform GMV Pipeline",
      value: `₹${(totalGMV / 10000000).toFixed(2)} Cr`,
      sub: "+32% growth QoQ",
      icon: IndianRupee,
      color: "text-[#641E3D]",
      bg: "bg-[#FAF5EC]",
    },
    {
      label: "Pending Verification",
      value: pendingVendors.length,
      sub: "Requires audit",
      icon: ClipboardList,
      color: "text-[#8A6A23]",
      bg: "bg-[#FAF1E3]",
      href: "/admin/queue",
    },
    {
      label: "Verified Partner Network",
      value: verifiedVendors.length,
      sub: "Active across 8 cities",
      icon: ShieldCheck,
      color: "text-[#287857]",
      bg: "bg-[#EBF8F2]",
      href: "/admin/vendors",
    },
    {
      label: "Total Customer Inquiries",
      value: inquiries.length,
      sub: "82% response rate",
      icon: MessageSquareText,
      color: "text-[#641E3D]",
      bg: "bg-[#FAF5EC]",
      href: "/admin/inquiries",
    },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#641E3D] text-white text-[9px] font-extrabold uppercase tracking-wider">
                Super Admin HQ
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
                Platform Command & Oversight
              </h1>
            </div>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Global marketplace metrics, partner verification queue, and celebration pipeline analytics
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/queue"
              className="px-4 py-2 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              Review Verification Queue ({pendingVendors.length})
            </Link>
          </div>
        </div>

        {/* ──── STATS GRID ──── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {statsCards.map((card, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-[#EFE3CF] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">{card.label}</span>
                <div className={`p-1 rounded-md ${card.bg} ${card.color}`}>
                  <card.icon className="size-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#2A121E]">{card.value}</span>
                <span className="text-[10px] font-bold text-[#287857]">{card.sub}</span>
              </div>
              {card.href && (
                <Link href={card.href} className="text-[9.5px] font-bold text-[#641E3D] hover:underline block pt-0.5">
                  View Dossier →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ──── PLATFORM ANALYTICS ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#EFE3CF] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
                <TrendingUp className="size-3.5" />
                Category Density & Partner Distribution
              </h3>
              <span className="text-[10px] font-bold text-[#8A6A23]">8 Active Categories</span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { cat: "Luxury Palaces & Venues", count: 12, share: "28%", color: "bg-[#641E3D]" },
                { cat: "Gourmet Catering & Kitchens", count: 10, share: "24%", color: "bg-[#D2AD6B]" },
                { cat: "Candid Cinema & Photography", count: 9, share: "22%", color: "bg-[#8C2E58]" },
                { cat: "Floral & Stage Architecture (Decor)", count: 7, share: "16%", color: "bg-[#287857]" },
                { cat: "Bridal Styling & Entertainment", count: 4, share: "10%", color: "bg-[#3B5998]" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#2A121E]">{item.cat}</span>
                    <span className="text-[#786B70]">{item.count} Partners ({item.share})</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF5EC] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Queue Spotlight (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#EFE3CF] space-y-3.5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
                  <ClipboardList className="size-3.5" />
                  Recent Verification Submissions
                </h3>
                <Link href="/admin/queue" className="text-[10.5px] font-bold text-[#641E3D] hover:underline">
                  Full Queue →
                </Link>
              </div>

              <div className="space-y-2.5 pt-3">
                {vendors.slice(0, 3).map((v) => (
                  <div key={v.id} className="p-3 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2A121E]">{v.businessName}</p>
                      <p className="text-[10px] text-[#786B70]">{v.category} • {v.city}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                      v.status === 'VERIFIED' ? 'bg-[#EBF8F2] text-[#287857]' : 'bg-[#FAF1E3] text-[#8A6A23]'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#FCFAF6] border border-[#ECD8B5] rounded-xl text-[10.5px] text-[#786B70]">
              🛡️ <b>Admin Protocol:</b> Verify that starting prices are within ±15% of market averages before granting the <b>Verified Partner</b> badge.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
