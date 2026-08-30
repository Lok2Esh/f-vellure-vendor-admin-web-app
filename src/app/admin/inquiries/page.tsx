"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllInquiries, getAllVendors } from "@/lib/vendorStore";
import { InquiryItem, VendorAccount } from "@/lib/mockData";
import { MessageSquareText, CalendarDays, IndianRupee, Users, Search, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [vendors, setVendors] = useState<VendorAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setInquiries(getAllInquiries());
    setVendors(getAllVendors());
  }, []);

  const getVendorName = (vId: string) => {
    return vendors.find((v) => v.id === vId)?.businessName || "Assigned Partner";
  };

  const filtered = inquiries.filter((inq) => {
    return (
      inq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Global Customer Inquiries & Briefs ({inquiries.length})
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Oversight of all customer-to-partner inquiries, submitted budgets, and quotation statuses
            </p>
          </div>
        </div>

        {/* ──── TABLE ──── */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">
                <tr>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Target Partner Atelier</th>
                  <th className="py-3 px-4">Event Type & City</th>
                  <th className="py-3 px-4">Date & Budget</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE4]">
                {filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FCFAF6] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{inq.customerName}</p>
                      <p className="text-[10px] text-[#786B70]">{inq.customerPhone} • {inq.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#641E3D]">{getVendorName(inq.vendorId)}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{inq.eventType}</p>
                      <p className="text-[10px] text-[#786B70]">{inq.city}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">₹{(inq.budget / 100000).toFixed(1)} Lakhs</p>
                      <p className="text-[10px] text-[#8A6A23]">{inq.eventDate}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        inq.status === 'NEW'
                          ? 'bg-[#FAF1E3] text-[#8A6A23] border-[#ECD8B5]'
                          : inq.status === 'QUOTED'
                          ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {inq.status}
                      </span>
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
