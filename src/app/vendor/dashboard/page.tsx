"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor, getInquiriesForVendor, getPortfolioForVendor, updateInquiryStatus } from "@/lib/vendorStore";
import { VendorAccount, InquiryItem } from "@/lib/mockData";
import { 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Briefcase, 
  Star, 
  TrendingUp, 
  IndianRupee, 
  CalendarDays, 
  ArrowUpRight, 
  MessageSquareText, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  XCircle,
  FileText,
  X
} from "lucide-react";

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorAccount | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [selectedInquiryForQuote, setSelectedInquiryForQuote] = useState<InquiryItem | null>(null);
  const [quoteItems, setQuoteItems] = useState([
    { desc: "Lead Specialist Master Package", qty: 1, rate: 250000, total: 250000 },
    { desc: "Crew Setup, Rehearsal & Power Redundancy", qty: 1, rate: 50000, total: 50000 },
  ]);
  const [quoteTerms, setQuoteTerms] = useState("50% Advance to secure calendar lock. 50% upon event start.");
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState("");

  useEffect(() => {
    const v = getCurrentVendor();
    setVendor(v);
    setInquiries(getInquiriesForVendor(v.id));
    setPortfolioCount(getPortfolioForVendor(v.id).length);
  }, []);

  if (!vendor) return null;

  const totalPipelineRevenue = inquiries.reduce((acc, inq) => acc + (inq.budget || 0), 0);
  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;
  const quotedInquiriesCount = inquiries.filter((i) => i.status === "QUOTED").length;

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryForQuote) return;

    const subtotal = quoteItems.reduce((acc, it) => acc + it.total, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    updateInquiryStatus(selectedInquiryForQuote.id, "QUOTED", {
      lineItems: quoteItems,
      subtotal,
      tax,
      total,
      validUntil: "2026-10-15",
      terms: quoteTerms,
    });

    setInquiries(getInquiriesForVendor(vendor.id));
    setQuoteSuccessMsg(`Quote of ₹${total.toLocaleString('en-IN')} sent to ${selectedInquiryForQuote.customerName}!`);
    setTimeout(() => {
      setSelectedInquiryForQuote(null);
      setQuoteSuccessMsg("");
    }, 1500);
  };

  const handleAddLineItem = () => {
    setQuoteItems([...quoteItems, { desc: "Additional Custom Deliverable", qty: 1, rate: 25000, total: 25000 }]);
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const next = [...quoteItems];
    (next[index] as any)[field] = val;
    next[index].total = Number(next[index].qty || 1) * Number(next[index].rate || 0);
    setQuoteItems(next);
  };

  const handleRemoveLineItem = (index: number) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter((_, i) => i !== index));
    }
  };

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <div className="space-y-6">
        {/* ──── 1. ATELIER EXECUTIVE HEADER ──── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[#641E3D] text-white flex items-center justify-center font-serif font-bold text-xl shadow-md shadow-[#641E3D]/10">
              {vendor.businessName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
                  {vendor.businessName}
                </h1>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                  vendor.status === 'VERIFIED'
                    ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
                    : 'bg-[#FAF1E3] text-[#8A6A23] border-[#ECD8B5]'
                }`}>
                  {vendor.status === 'VERIFIED' ? <ShieldCheck className="size-3" /> : <ShieldAlert className="size-3" />}
                  {vendor.status === 'VERIFIED' ? 'Verified Partner' : 'Verification Pending'}
                </div>
              </div>
              <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
                {vendor.category} • {vendor.city} {vendor.locality ? `(${vendor.locality})` : ''} • Benchmark: ₹{vendor.basePrice.toLocaleString('en-IN')} {vendor.priceType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/vendor/profile"
              className="px-3.5 py-2 rounded-xl bg-[#FAF5EC] hover:bg-[#F3EADB] border border-[#EFE3CF] text-[11px] font-bold text-[#641E3D] transition-all"
            >
              Edit Pricing & Services
            </Link>
            <Link
              href="/vendor/portfolio"
              className="px-3.5 py-2 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="size-3.5" />
              + Add Work History
            </Link>
          </div>
        </div>

        {/* ──── 2. HIGH-DENSITY 4-KPI METRIC GRID ──── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* KPI 1: Pipeline Revenue */}
          <div className="bg-white p-4 rounded-xl border border-[#EFE3CF] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">Pipeline Inquiries</span>
              <div className="p-1 rounded-md bg-[#FAF5EC] text-[#641E3D]">
                <IndianRupee className="size-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#2A121E]">
                ₹{(totalPipelineRevenue / 100000).toFixed(1)}L
              </span>
              <span className="text-[10px] font-bold text-[#287857]">+18.4% MoM</span>
            </div>
            <p className="text-[9.5px] text-[#786B70]">{inquiries.length} active client opportunities</p>
          </div>

          {/* KPI 2: Active Inquiries Requiring Action */}
          <div className="bg-white p-4 rounded-xl border border-[#EFE3CF] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">Pending Quotes</span>
              <div className="p-1 rounded-md bg-[#FAF1E3] text-[#8A6A23]">
                <MessageSquareText className="size-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#2A121E]">{newInquiriesCount} New</span>
              <span className="text-[10px] font-bold text-[#8A6A23]">{quotedInquiriesCount} Quoted</span>
            </div>
            <p className="text-[9.5px] text-[#786B70]">Avg response time: &lt; 45 mins</p>
          </div>

          {/* KPI 3: Profile Impressions */}
          <div className="bg-white p-4 rounded-xl border border-[#EFE3CF] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">Marketplace Views</span>
              <div className="p-1 rounded-md bg-[#FAF5EC] text-[#641E3D]">
                <Eye className="size-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#2A121E]">1.8k</span>
              <span className="text-[10px] font-bold text-[#287857]">+24% vs last mo</span>
            </div>
            <p className="text-[9.5px] text-[#786B70]">Ranked #1 in {vendor.city} {vendor.category}</p>
          </div>

          {/* KPI 4: Trust Score & Portfolio */}
          <div className="bg-white p-4 rounded-xl border border-[#EFE3CF] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">Rating & Showcase</span>
              <div className="p-1 rounded-md bg-[#FAF5EC] text-[#D2AD6B]">
                <Star className="size-3.5 fill-[#D2AD6B]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#2A121E]">{vendor.rating} ★</span>
              <span className="text-[10px] font-bold text-[#786B70]">({vendor.reviewsCount} reviews)</span>
            </div>
            <p className="text-[9.5px] text-[#786B70]">{portfolioCount} Published Wedding Works</p>
          </div>
        </div>

        {/* ──── 3. CHARTS & ANALYTICS SECTION ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart 1: Inquiry Velocity & Conversion Trend (2 cols) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#EFE3CF] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
                  <TrendingUp className="size-3.5" />
                  Monthly Inquiry Velocity & Deal Closure
                </h3>
                <p className="text-[10px] text-[#786B70]">Lead pipeline velocity across 2026 celebration quarters</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF5EC] text-[#641E3D] border border-[#EFE3CF]">
                Peak Season Ahead
              </span>
            </div>

            {/* Sparkline / Bar Visualization */}
            <div className="grid grid-cols-6 gap-2 pt-4 items-end h-40 border-b border-[#F7EFE4] pb-2">
              {[
                { month: "Jun", leads: 14, confirmed: 6, h: 55 },
                { month: "Jul", leads: 18, confirmed: 8, h: 68 },
                { month: "Aug", leads: 24, confirmed: 11, h: 88 },
                { month: "Sep", leads: 32, confirmed: 16, h: 110 },
                { month: "Oct (Proj)", leads: 44, confirmed: 22, h: 135 },
                { month: "Nov (Proj)", leads: 52, confirmed: 28, h: 150 },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-bold text-[#641E3D] opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.leads} Leads
                  </span>
                  <div className="w-full max-w-[36px] bg-[#FAF5EC] rounded-t-lg overflow-hidden flex flex-col justify-end border border-[#EFE3CF]">
                    <div 
                      style={{ height: `${bar.h}px` }} 
                      className="w-full bg-[#641E3D] transition-all group-hover:bg-[#8C2E58] flex items-end justify-center"
                    >
                      <div style={{ height: `${bar.h * 0.45}px` }} className="w-full bg-[#D2AD6B]" />
                    </div>
                  </div>
                  <span className="text-[9.5px] font-bold text-[#786B70]">{bar.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#786B70] pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#641E3D]" /> Total Inquiries
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#D2AD6B]" /> Confirmed Contracts
                </span>
              </div>
              <span className="font-bold text-[#287857]">Overall Conversion: 48.2%</span>
            </div>
          </div>

          {/* Chart 2: Lead Acquisition Source (1 col) */}
          <div className="bg-white p-5 rounded-2xl border border-[#EFE3CF] space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Lead Acquisition Channels
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#2A121E]">Custom Celebration Suites</span>
                  <span className="text-[#641E3D]">46% (₹16.2L)</span>
                </div>
                <div className="h-2 w-full bg-[#FAF5EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#641E3D] rounded-full" style={{ width: "46%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#2A121E]">Direct Marketplace Search</span>
                  <span className="text-[#8A6A23]">34% (₹12.0L)</span>
                </div>
                <div className="h-2 w-full bg-[#FAF5EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D2AD6B] rounded-full" style={{ width: "34%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#2A121E]">Partner Concierge Broadcasts</span>
                  <span className="text-[#287857]">20% (₹7.0L)</span>
                </div>
                <div className="h-2 w-full bg-[#FAF5EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#287857] rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-[10.5px] text-[#786B70] leading-relaxed">
              💡 <b>Pro Tip:</b> Couples building custom celebration suites convert <b>2.4x faster</b> when your pricing benchmark is accurate.
            </div>
          </div>
        </div>

        {/* ──── 4. RECENT INCOMING INQUIRIES & QUOTE ACTIONS TABLE ──── */}
        <div className="bg-white rounded-2xl border border-[#EFE3CF] overflow-hidden shadow-sm space-y-0">
          <div className="p-4 px-5 border-b border-[#EFE3CF] flex items-center justify-between bg-[#FCFAF6]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5">
                <MessageSquareText className="size-3.5" />
                Live Customer Inquiries & Briefs ({inquiries.length})
              </h3>
              <p className="text-[10px] text-[#786B70]">Real-time leads submitted via Vellure Marketplace & Custom Suite Builder</p>
            </div>
            <Link
              href="/vendor/inquiries"
              className="text-[10.5px] font-bold text-[#641E3D] hover:underline flex items-center gap-1"
            >
              View Full Inquiries Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EC] border-b border-[#EFE3CF] text-[9.5px] font-bold uppercase tracking-wider text-[#8A7A70]">
                <tr>
                  <th className="py-3 px-4">Customer & Couple</th>
                  <th className="py-3 px-4">Celebration Details</th>
                  <th className="py-3 px-4">Scale & Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE4]">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FCFAF6] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">{inq.customerName}</p>
                      <p className="text-[10px] text-[#786B70]">{inq.customerPhone} • {inq.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#641E3D]">{inq.eventType}</p>
                      <p className="text-[10px] text-[#786B70] flex items-center gap-1">
                        <CalendarDays className="size-3 text-[#8A6A23]" />
                        {inq.eventDate} ({inq.city})
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2A121E]">₹{(inq.budget / 100000).toFixed(1)} Lakhs</p>
                      <p className="text-[10px] text-[#786B70]">{inq.guestCount} Estimated Guests</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        inq.status === 'NEW'
                          ? 'bg-[#FAF1E3] text-[#8A6A23] border-[#ECD8B5]'
                          : inq.status === 'QUOTED'
                          ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {inq.status === 'NEW' ? '● New Request' : inq.status === 'QUOTED' ? '✓ Quote Sent' : inq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {inq.status === 'NEW' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryForQuote(inq)}
                          className="px-3 py-1.5 rounded-lg bg-[#641E3D] hover:bg-[#4E152F] text-white text-[10.5px] font-bold transition-all shadow-sm"
                        >
                          + Send Quote
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryForQuote(inq)}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF5EC] border border-[#EFE3CF] text-[#641E3D] text-[10.5px] font-bold hover:bg-[#F3EADB] transition-all"
                        >
                          View Quote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ──── 5. BESPOKE QUOTATION BUILDER MODAL ──── */}
      {selectedInquiryForQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#EFE3CF] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EFE3CF] bg-[#FCFAF6] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2A121E]">
                  Create Bespoke Quotation
                </h3>
                <p className="text-[10.5px] text-[#786B70]">
                  For {selectedInquiryForQuote.customerName} • {selectedInquiryForQuote.eventType} on {selectedInquiryForQuote.eventDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiryForQuote(null)}
                className="size-8 rounded-lg border border-[#EFE3CF] hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendQuote} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {quoteSuccessMsg && (
                <div className="bg-[#EBF8F2] border border-[#C3ECD8] text-[#287857] p-3 rounded-xl font-bold text-center">
                  {quoteSuccessMsg}
                </div>
              )}

              {/* Inquiry Brief Summary */}
              <div className="p-3 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] font-bold text-[#8A7A70] uppercase">Target Budget</span>
                  <p className="font-bold text-[#2A121E]">₹{(selectedInquiryForQuote.budget / 100000).toFixed(1)} Lakhs</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#8A7A70] uppercase">Guest Scale</span>
                  <p className="font-bold text-[#2A121E]">{selectedInquiryForQuote.guestCount} Guests</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-[#8A7A70] uppercase">Location</span>
                  <p className="font-bold text-[#2A121E]">{selectedInquiryForQuote.city}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#641E3D]">
                    Quotation Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[10.5px] font-bold text-[#641E3D] hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                        placeholder="Service deliverable description..."
                        className="flex-1 px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg text-xs font-semibold outline-none"
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                        placeholder="Rate ₹"
                        className="w-28 px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-lg text-xs font-semibold outline-none"
                      />
                      <span className="w-24 text-right font-bold text-[#2A121E]">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                      {quoteItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 bg-[#FCFAF6] border border-[#EFE3CF] rounded-xl space-y-1.5 text-right">
                <div className="flex justify-between text-[#786B70]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2A121E]">
                    ₹{quoteItems.reduce((acc, it) => acc + it.total, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#786B70]">
                  <span>Estimated GST (18%)</span>
                  <span className="font-bold text-[#2A121E]">
                    ₹{Math.round(quoteItems.reduce((acc, it) => acc + it.total, 0) * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#641E3D] pt-1.5 border-t border-[#EFE3CF]">
                  <span>Total Proposed Quote</span>
                  <span>
                    ₹{Math.round(quoteItems.reduce((acc, it) => acc + it.total, 0) * 1.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1">
                  Payment Milestone & Terms
                </label>
                <textarea
                  rows={2}
                  value={quoteTerms}
                  onChange={(e) => setQuoteTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-medium outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiryForQuote(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5EC] border border-[#EFE3CF] text-xs font-bold text-[#786B70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Transmit Official Quote →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
