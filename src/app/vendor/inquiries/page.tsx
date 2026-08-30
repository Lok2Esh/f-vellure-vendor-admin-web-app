"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor, getInquiriesForVendor, updateInquiryStatus } from "@/lib/vendorStore";
import { InquiryItem } from "@/lib/mockData";
import { 
  MessageSquareText, 
  CalendarDays, 
  IndianRupee, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  X, 
  FileText, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Send
} from "lucide-react";

export default function VendorInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  // Quote Builder State
  const [quoteItems, setQuoteItems] = useState([
    { desc: "Lead Specialist Master Package", qty: 1, rate: 250000, total: 250000 },
    { desc: "Crew Setup, Rehearsal & Power Redundancy", qty: 1, rate: 50000, total: 50000 },
  ]);
  const [quoteTerms, setQuoteTerms] = useState("50% Advance on booking. 50% upon event start.");
  const [successToast, setSuccessToast] = useState("");

  const vendor = getCurrentVendor();

  useEffect(() => {
    setInquiries(getInquiriesForVendor(vendor.id));
  }, [vendor.id]);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = filterStatus === "ALL" || inq.status === filterStatus;
    const matchesSearch =
      inq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    const subtotal = quoteItems.reduce((acc, it) => acc + it.total, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    updateInquiryStatus(selectedInquiry.id, "QUOTED", {
      lineItems: quoteItems,
      subtotal,
      tax,
      total,
      validUntil: "2026-11-01",
      terms: quoteTerms,
    });

    setInquiries(getInquiriesForVendor(vendor.id));
    setSuccessToast(`Official Quote of ₹${total.toLocaleString('en-IN')} sent to ${selectedInquiry.customerName}!`);
    setTimeout(() => {
      setSelectedInquiry(null);
      setSuccessToast("");
    }, 1200);
  };

  const handleAddLineItem = () => {
    setQuoteItems([...quoteItems, { desc: "Additional Deliverable", qty: 1, rate: 20000, total: 20000 }]);
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const next = [...quoteItems];
    (next[index] as any)[field] = val;
    next[index].total = Number(next[index].qty || 1) * Number(next[index].rate || 0);
    setQuoteItems(next);
  };

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-6">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Leads & Quotation Management Desk ({inquiries.length})
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Review incoming customer celebration briefs, generate bespoke PDF quotes, and track calendar locks
            </p>
          </div>
        </div>

        {/* ──── FILTER & SEARCH BAR ──── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EFE3CF]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {["ALL", "NEW", "QUOTED", "CONFIRMED", "DECLINED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === st
                    ? "bg-[#641E3D] text-white shadow-sm"
                    : "bg-[#FAF5EC] text-[#786B70] hover:bg-[#F3EADB] border border-[#EFE3CF]"
                }`}
              >
                {st} {st !== 'ALL' ? `(${inquiries.filter(i => i.status === st).length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#A48F97]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search couple or city..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold outline-none"
            />
          </div>
        </div>

        {/* ──── INQUIRIES LIST / TABLE (TINY HIGH DENSITY) ──── */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">
                <tr>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Celebration & City</th>
                  <th className="py-3 px-4">Date & Timeline</th>
                  <th className="py-3 px-4">Scale & Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quotation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE4]">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FCFAF6] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{inq.customerName}</p>
                      <p className="text-[10px] text-[#786B70]">{inq.customerPhone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#641E3D]">{inq.eventType}</p>
                      <p className="text-[10px] text-[#786B70]">{inq.city}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{inq.eventDate}</p>
                      <p className="text-[9.5px] text-[#8A6A23]">Target Lock</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">₹{(inq.budget / 100000).toFixed(1)}L</p>
                      <p className="text-[10px] text-[#786B70]">{inq.guestCount} Guests</p>
                    </td>

                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-3 py-1.5 rounded-lg bg-[#641E3D] hover:bg-[#4E152F] text-white text-[10.5px] font-bold transition-all shadow-sm"
                      >
                        {inq.status === 'QUOTED' ? 'View / Edit Quote' : '+ Build Quote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ──── QUOTATION BUILDER MODAL ──── */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#EFE3CF] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#EFE3CF] bg-[#FCFAF6] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2A121E]">
                  Official Quotation Builder
                </h3>
                <p className="text-[10.5px] text-[#786B70]">
                  Client: {selectedInquiry.customerName} ({selectedInquiry.customerPhone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="size-8 rounded-lg border border-[#EFE3CF] hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSendQuote} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {successToast && (
                <div className="bg-[#EBF8F2] border border-[#C3ECD8] text-[#287857] p-3 rounded-xl font-bold text-center">
                  {successToast}
                </div>
              )}

              {/* Inquiry Notes */}
              {selectedInquiry.notes && (
                <div className="p-3 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl">
                  <span className="text-[9px] font-bold uppercase text-[#8A7A70] block mb-0.5">Client Note / Brief</span>
                  <p className="text-[11px] text-[#2A121E] font-medium">{selectedInquiry.notes}</p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#641E3D]">Deliverables Line Items</span>
                  <button type="button" onClick={handleAddLineItem} className="text-[10.5px] font-bold text-[#641E3D] hover:underline">
                    + Add Item
                  </button>
                </div>

                {quoteItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg text-xs font-semibold outline-none"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                      className="w-28 px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg text-xs font-semibold outline-none"
                    />
                    <span className="w-24 text-right font-bold text-[#2A121E]">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl space-y-1.5 text-right">
                <div className="flex justify-between text-[#786B70]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2A121E]">
                    ₹{quoteItems.reduce((acc, it) => acc + it.total, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#786B70]">
                  <span>GST (18%)</span>
                  <span className="font-bold text-[#2A121E]">
                    ₹{Math.round(quoteItems.reduce((acc, it) => acc + it.total, 0) * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#641E3D] pt-1.5 border-t border-[#EFE3CF]">
                  <span>Total Payable</span>
                  <span>
                    ₹{Math.round(quoteItems.reduce((acc, it) => acc + it.total, 0) * 1.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] text-xs font-bold text-[#786B70]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Send Official Quote →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
