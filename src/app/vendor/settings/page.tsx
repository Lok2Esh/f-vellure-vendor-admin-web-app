"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentVendor } from "@/lib/vendorStore";
import { 
  Sliders, 
  ShieldCheck, 
  Save, 
  CreditCard, 
  Bell, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Zap,
  Globe
} from "lucide-react";

export default function VendorSettingsPage() {
  const vendor = getCurrentVendor();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [instantInquiries, setInstantInquiries] = useState(true);
  const [whatsAppBroadcasts, setWhatsAppBroadcasts] = useState(true);
  const [autoQuoteEnabled, setAutoQuoteEnabled] = useState(false);
  const [publicBenchmarkDisplay, setPublicBenchmarkDisplay] = useState(true);

  // Payout Details
  const [bankName, setBankName] = useState("HDFC Bank — Patiala Main Branch");
  const [accountNumber, setAccountNumber] = useState("50200087654321");
  const [ifscCode, setIfscCode] = useState("HDFC0001234");
  const [gstin, setGstin] = useState("03AAAAA0000A1Z5");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <DashboardLayout allowedRoles={["VENDOR"]}>
      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* ──── TOP HEADER ──── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EFE3CF] shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A121E]">
              Atelier Settings & Feature Customization
            </h1>
            <p className="text-[11px] text-[#786B70] font-medium mt-0.5">
              Control your assigned marketplace features, instant lead routing, and bank settlement credentials
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
          >
            <Save className="size-3.5" />
            Save Preferences
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-[#EBF8F2] border border-[#C3ECD8] rounded-xl text-xs font-bold text-[#287857] flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Atelier preferences and banking details saved successfully!
          </div>
        )}

        {/* ──── FEATURE CUSTOMIZATION TOGGLES ──── */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
            <Zap className="size-4" />
            1. Marketplace & Lead Feature Toggles
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF5EC] rounded-xl border border-[#EFE3CF]">
              <div>
                <h4 className="font-bold text-xs text-[#2A121E]">Direct Concierge Lead Routing</h4>
                <p className="text-[10.5px] text-[#786B70]">Receive high-value celebration inquiries directly into your atelier workspace</p>
              </div>
              <input
                type="checkbox"
                checked={instantInquiries}
                onChange={(e) => setInstantInquiries(e.target.checked)}
                className="size-4 accent-[#641E3D] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF5EC] rounded-xl border border-[#EFE3CF]">
              <div>
                <h4 className="font-bold text-xs text-[#2A121E]">Instant WhatsApp Alert Notifications</h4>
                <p className="text-[10.5px] text-[#786B70]">Receive SMS / WhatsApp alerts when a verified couple requests a bespoke quote</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppBroadcasts}
                onChange={(e) => setWhatsAppBroadcasts(e.target.checked)}
                className="size-4 accent-[#641E3D] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF5EC] rounded-xl border border-[#EFE3CF]">
              <div>
                <h4 className="font-bold text-xs text-[#2A121E]">Public Benchmark Display</h4>
                <p className="text-[10.5px] text-[#786B70]">Display your starting rate benchmark on the customer marketplace discovery feed</p>
              </div>
              <input
                type="checkbox"
                checked={publicBenchmarkDisplay}
                onChange={(e) => setPublicBenchmarkDisplay(e.target.checked)}
                className="size-4 accent-[#641E3D] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ──── BANKING & PAYOUT SETTLEMENTS ──── */}
        <div className="bg-white p-6 rounded-2xl border border-[#EFE3CF] shadow-sm space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D] flex items-center gap-1.5 pb-2 border-b border-[#F7EFE4]">
            <CreditCard className="size-4" />
            2. Payout Account & GSTIN Credentials
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                Bank Name & Branch
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                Settlement Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                Bank IFSC Code
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#786B70] uppercase mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
