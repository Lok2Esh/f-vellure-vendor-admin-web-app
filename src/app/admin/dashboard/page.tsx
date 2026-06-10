"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Users, ClipboardList, Wallet, ArrowUpRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminStats {
  totalVendors: number;
  pendingVendors: number;
  verifiedVendors: number;
  totalBudgets: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statsCards = [
    { 
      label: "Total Vendors", 
      value: stats?.totalVendors || 0, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Pending Verifications", 
      value: stats?.pendingVendors || 0, 
      icon: ClipboardList, 
      color: "text-burgundy", 
      bg: "bg-burgundy/5" 
    },
    { 
      label: "Verified Partners", 
      value: stats?.verifiedVendors || 0, 
      icon: ArrowUpRight, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "AI Budgets Generated", 
      value: stats?.totalBudgets || 0, 
      icon: Wallet, 
      color: "text-gold", 
      bg: "bg-gold/5" 
    },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 mt-2 font-medium">Monitoring the global Vellure ecosystem</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="luxury-card h-32 animate-pulse bg-gray-50" />
            ))
          ) : (
            statsCards.map((card) => (
              <div key={card.label} className="luxury-card border-none ring-1 ring-gray-100 flex items-center gap-5">
                <div className={`${card.bg} p-4 rounded-xl`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions / Recent Activity Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 luxury-card">
            <h3 className="text-xl font-serif font-bold mb-6">Recent Verifications</h3>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-gray-50 p-6 rounded-full">
                <ClipboardList className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Incoming request audit logs will appear here</p>
            </div>
          </div>
          
          <div className="luxury-card bg-burgundy text-white">
            <h3 className="text-xl font-serif font-bold mb-4">Verification Priority</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
              "We maintain the highest standards for our partners. Please audit each vendor's portfolio thoroughly before manual approval."
            </p>
            <button className="w-full bg-gold text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all text-xs tracking-widest uppercase">
              Go to Queue
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
