"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, XCircle, Search, Mail, MapPin, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorInQueue {
  id: string;
  businessName: string;
  category: string;
  city: string;
  basePrice: number;
  priceType: string;
  user: {
    email: string;
    phone: string;
  };
  createdAt: string;
}

export default function AdminQueue() {
  const [vendors, setVendors] = useState<VendorInQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get("/admin/queue");
      setVendors(response.data.vendors);
    } catch (err) {
      console.error("Failed to fetch queue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      await api.put(`/admin/vendors/${id}/${action}`, action === "reject" ? { reason: "Standard rejection" } : {});
      // Refresh local list
      setVendors(vendors.filter(v => v.id !== id));
    } catch (err) {
      console.error(`Action ${action} failed`, err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Verification Queue</h1>
          <p className="text-gray-500 mt-2 font-medium">Review and verify luxury partnership applications</p>
        </div>

        {/* Global Search / Filter Placeholder */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vendor name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>
          <div className="px-5 py-2 border rounded-xl bg-champagne text-xs font-bold uppercase tracking-widest text-burgundy cursor-pointer hover:bg-white transition-all">
            Filter: PENDING
          </div>
        </div>

        {/* Table Body */}
        <div className="luxury-card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Business Name</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Location / Pricing</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-10 bg-gray-50/10" />
                  </tr>
                ))
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                    No pending verifications at this time.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-burgundy transition-colors">{vendor.businessName}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 font-medium">
                         <Mail className="w-3 h-3" />
                         {vendor.user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-champagne text-burgundy text-[10px] font-bold rounded-lg border border-burgundy/10 uppercase tracking-wider">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <MapPin className="w-4 h-4 text-gold" />
                        {vendor.city}
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-wide">
                        {formatPrice(vendor.basePrice, vendor.priceType)}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          className="p-2.5 rounded-xl bg-champagne hover:bg-gold hover:text-white text-gold transition-all shadow-sm border border-gold/10"
                          title="View Portfolio"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          disabled={!!actionLoading}
                          onClick={() => handleAction(vendor.id, "approve")}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          {actionLoading === vendor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          APPROVE
                        </button>
                        <button 
                          disabled={!!actionLoading}
                          onClick={() => handleAction(vendor.id, "reject")}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-red-500/20 active:translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          REJECT
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-widest px-2">
            <span>{vendors.length} Pending Partners</span>
            <span>Priority Queue: First-in First-out</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
