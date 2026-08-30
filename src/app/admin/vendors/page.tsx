"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllVendors, updateVendorProfile } from "@/lib/vendorStore";
import { VendorAccount } from "@/lib/mockData";
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  IndianRupee, 
  Star, 
  Eye, 
  MoreVertical,
  CheckCircle2
} from "lucide-react";

export default function AdminVendorsDirectoryPage() {
  const [vendors, setVendors] = useState<VendorAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");

  useEffect(() => {
    setVendors(getAllVendors());
  }, []);

  const handleStatusChange = (vendorId: string, status: VendorAccount['status']) => {
    updateVendorProfile({ status }, vendorId);
    setVendors(getAllVendors());
  };

  const filtered = vendors.filter((v) => {
    const matchesCat = selectedCategory === "ALL" || v.category === selectedCategory;
    const matchesCity = selectedCity === "ALL" || v.city === selectedCity;
    const matchesSearch =
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesCity && matchesSearch;
  });

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              All Partners Directory ({vendors.length})
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Global directory of verified luxury ateliers, commission tiers, and verification statuses
            </p>
          </div>
        </div>

        {/* ──── SEARCH & FILTERS ──── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EFE3CF]">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="VENUE">Palaces & Venues</option>
              <option value="CATERING">Catering & Feasts</option>
              <option value="PHOTOGRAPHY">Photography & Cinema</option>
              <option value="DECOR">Decor & Floral</option>
            </select>

            {/* City Select */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
            >
              <option value="ALL">All Cities</option>
              <option value="Patiala">Patiala</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Ludhiana">Ludhiana</option>
              <option value="Amritsar">Amritsar</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#A48F97]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner or city..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
            />
          </div>
        </div>

        {/* ──── ALL VENDORS TABLE ──── */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">
                <tr>
                  <th className="py-3 px-4">Partner Name & Lead</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">City & Territory</th>
                  <th className="py-3 px-4">Benchmark Rate</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE4]">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FCFAF6] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{v.businessName}</p>
                      <p className="text-[10px] text-[#786B70]">{v.email} • {v.phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF5EC] border border-[#EFE3CF] text-[9px] font-bold text-[#641E3D]">
                        {v.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{v.city}</p>
                      <p className="text-[10px] text-[#786B70]">{v.serviceRadiusKm} km Radius</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#641E3D]">₹{v.basePrice.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-[#8A7A70] uppercase">{v.priceType}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[#D2AD6B] font-bold">
                        <Star className="size-3 fill-[#D2AD6B]" />
                        <span className="text-[#2A121E]">{v.rating}</span>
                        <span className="text-[10px] text-[#786B70]">({v.reviewsCount})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                          v.status === 'VERIFIED'
                            ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
                            : v.status === 'PENDING'
                            ? 'bg-[#FAF1E3] text-[#8A6A23] border-[#ECD8B5]'
                            : 'bg-[#FDEDF0] text-[#B63A4A] border-[#F8CCD3]'
                        }`}
                      >
                        <option value="VERIFIED">✓ Verified</option>
                        <option value="PENDING">● Pending</option>
                        <option value="SUSPENDED">✕ Suspended</option>
                        <option value="REJECTED">✕ Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
