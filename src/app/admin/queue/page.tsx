"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllVendors, updateVendorProfile } from "@/lib/vendorStore";
import { VendorAccount } from "@/lib/mockData";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  MapPin, 
  IndianRupee, 
  Phone, 
  Mail, 
  X, 
  Star,
  Users,
  Store
} from "lucide-react";

export default function AdminQueuePage() {
  const [vendors, setVendors] = useState<VendorAccount[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorAccount | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    setVendors(getAllVendors());
  }, []);

  const pendingVendors = vendors.filter((v) => v.status === "PENDING");

  const handleApprove = (vendorId: string) => {
    updateVendorProfile({ status: "VERIFIED" }, vendorId);
    setVendors(getAllVendors());
    setActionSuccess(`Partner verified & granted verified badge!`);
    setTimeout(() => {
      setSelectedVendor(null);
      setActionSuccess("");
    }, 1200);
  };

  const handleReject = (vendorId: string) => {
    updateVendorProfile({ status: "REJECTED" }, vendorId);
    setVendors(getAllVendors());
    setActionSuccess(`Application rejected with note.`);
    setTimeout(() => {
      setSelectedVendor(null);
      setActionSuccess("");
    }, 1200);
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Partner Verification & Audit Queue ({pendingVendors.length} Pending)
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Review atelier dossiers, pricing authenticity, and approve verified luxury partner credentials
            </p>
          </div>
        </div>

        {/* ──── PENDING QUEUE TABLE ──── */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">
                <tr>
                  <th className="py-3 px-4">Business & Representative</th>
                  <th className="py-3 px-4">Category & City</th>
                  <th className="py-3 px-4">Pricing Benchmark</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Audit & Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE4]">
                {pendingVendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#786B70] italic">
                      No pending applications in the verification queue. All partners are up to date!
                    </td>
                  </tr>
                ) : (
                  pendingVendors.map((v) => (
                    <tr key={v.id} className="hover:bg-[#FCFAF6] transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#2A121E]">{v.businessName}</p>
                        <p className="text-[10px] text-[#786B70]">{v.name} • {v.phone}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#641E3D]">{v.category}</p>
                        <p className="text-[10px] text-[#786B70]">{v.city}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#2A121E]">₹{v.basePrice.toLocaleString("en-IN")}</p>
                        <p className="text-[9.5px] text-[#8A7A70] uppercase">{v.priceType}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#FAF1E3] text-[#8A6A23] border border-[#ECD8B5]">
                          ● Audit Required
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedVendor(v)}
                          className="px-3 py-1.5 rounded-lg bg-[#641E3D] hover:bg-[#4E152F] text-white text-[10.5px] font-bold shadow-sm"
                        >
                          Review Dossier →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ──── VENDOR DOSSIER MODAL ──── */}
        {selectedVendor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#EFE3CF] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#EFE3CF] bg-[#FCFAF6] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A121E]">
                    Partner Audit Dossier
                  </h3>
                  <p className="text-[10.5px] text-[#786B70]">
                    {selectedVendor.businessName} • {selectedVendor.category} in {selectedVendor.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="size-8 rounded-lg border border-[#EFE3CF] hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                {actionSuccess && (
                  <div className="bg-[#EBF8F2] border border-[#C3ECD8] text-[#287857] p-3 rounded-xl font-bold text-center">
                    {actionSuccess}
                  </div>
                )}

                {/* Bio & Details */}
                <div className="p-3.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl space-y-2">
                  <span className="text-[9px] font-bold uppercase text-[#8A7A70] block">Atelier Bio</span>
                  <p className="text-xs text-[#2A121E] leading-relaxed">{selectedVendor.bio || "No bio provided."}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl">
                    <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">Official Contact</span>
                    <p className="font-bold text-[#2A121E]">{selectedVendor.phone}</p>
                    <p className="text-[10px] text-[#786B70] truncate">{selectedVendor.email}</p>
                  </div>

                  <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl">
                    <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">Benchmark Rate</span>
                    <p className="font-bold text-[#641E3D]">₹{selectedVendor.basePrice.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-[#786B70]">{selectedVendor.priceType}</p>
                  </div>

                  <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl">
                    <span className="text-[9px] font-bold text-[#8A7A70] uppercase block">Service Territory</span>
                    <p className="font-bold text-[#2A121E]">{selectedVendor.city}</p>
                    <p className="text-[10px] text-[#786B70]">{selectedVendor.serviceRadiusKm} km Radius</p>
                  </div>
                </div>

                {/* Audit Feedback Note */}
                <div>
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                    Feedback / Rejection Reason (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Enter audit remarks or requested additional documents..."
                    className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F7EFE4]">
                  <button
                    type="button"
                    onClick={() => handleReject(selectedVendor.id)}
                    className="px-4 py-2 rounded-xl bg-[#FDEDF0] border border-[#F8CCD3] text-[#B63A4A] text-xs font-bold"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedVendor.id)}
                    className="px-5 py-2 rounded-xl bg-[#287857] hover:bg-[#1E5C42] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    ✓ Approve & Verify Partner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
