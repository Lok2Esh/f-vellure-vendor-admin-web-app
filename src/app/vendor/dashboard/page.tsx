"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { UserCircle, Eye, ShieldCheck, ShieldAlert, Image as ImageIcon, Briefcase, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorProfile {
  businessName: string;
  category: string;
  status: "VERIFIED" | "PENDING" | "REJECTED" | "SUSPENDED";
  rating: number;
  reviewsCount: number;
}

export default function VendorDashboard() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/vendors/profile");
        setProfile(response.data);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch vendor profile", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const stats = [
    { 
      label: "Views", 
      value: "1.2k", 
      sub: "+12% this month",
      icon: Eye, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Profile Strength", 
      value: "85%", 
      sub: "Needs portfolio",
      icon: Star, 
      color: "text-gold",
      bg: "bg-gold/5" 
    },
    { 
      label: "Total Leads", 
      value: "48", 
      sub: "8 new today",
      icon: Briefcase, 
      color: "text-burgundy",
      bg: "bg-burgundy/5"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return { label: "Verified Partner", icon: ShieldCheck, color: "bg-green-100 text-green-700 border-green-200" };
      case "PENDING":
        return { label: "Verification Pending", icon: ShieldAlert, color: "bg-burgundy text-white border-burgundy shadow-lg shadow-burgundy/20" };
      case "REJECTED":
        return { label: "Profile Rejected", icon: ShieldAlert, color: "bg-red-100 text-red-700 border-red-200" };
      default:
        return { label: "Suspended", icon: ShieldAlert, color: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  const status = profile ? getStatusBadge(profile.status) : null;

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-10">
        {/* Header with Status Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              Welcome, {profile?.businessName || "Partner"}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your luxury wedding services</p>
          </div>
          
          {loading ? (
            <div className="w-48 h-10 animate-pulse bg-gray-100 rounded-full" />
          ) : status && (
            <div className={cn("px-6 py-2.5 rounded-full border flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all", status.color)}>
              <status.icon className="w-4 h-4" />
              {status.label}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
              <div key={i} className="luxury-card h-32 animate-pulse bg-gray-50" />
            ))
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="luxury-card border-none ring-1 ring-gray-100 flex items-center gap-6">
                <div className={cn("p-4 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{stat.sub}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="luxury-card p-0 overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-xl font-serif font-bold">Portfolio Highlights</h3>
              <p className="text-gray-400 text-xs mt-1">Showcase your finest work to potential clients</p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm font-medium text-gray-500">You haven't uploaded any high-resolution images yet.</p>
              <button className="btn-gold uppercase tracking-widest font-bold text-xs ring-4 ring-gold/5">
                Add New Work
              </button>
            </div>
          </div>

          <div className="luxury-card flex flex-col justify-between bg-white bg-gradient-to-br from-white to-champagne/20">
            <div>
              <h3 className="text-xl font-serif font-bold">Category Expertise</h3>
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg text-burgundy font-bold text-sm border border-gray-100 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                {profile?.category || "Catering"}
              </div>
              <p className="mt-6 text-gray-500 text-sm leading-relaxed">
                "Maintaining an accurate base price and high-quality portfolio increases your visibility by up to 40% in the user search ranking."
              </p>
            </div>
            <button className="mt-10 w-full btn-burgundy uppercase tracking-widest font-bold text-xs shadow-lg shadow-burgundy/10">
              Edit Business Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
