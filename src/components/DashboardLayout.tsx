"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getAuthUser, User, UserRole, isAuthenticated } from "@/lib/auth";
import { Loader2, Bell, Sparkles, CheckCircle2, ShieldCheck, Search } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptingInquiries, setAcceptingInquiries] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const authUser = getAuthUser();
    
    // Check role authorization
    if (authUser && !allowedRoles.includes(authUser.role)) {
      router.push("/login");
      return;
    }

    setUser(authUser);
    setLoading(false);
  }, [allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#641E3D]/10 border border-[#D2AD6B]/30 mx-auto">
            <Loader2 className="w-6 h-6 animate-spin text-[#641E3D]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641E3D]">Entering Vellure Concierge...</p>
        </div>
      </div>
    );
  }

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen bg-[#FBF9F4] text-[#2A121E]">
      <Sidebar role={user.role} userName={user.name} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Executive Compact Top Header Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md border-b border-[#EFE3CF] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#786B70]">
              {currentDateStr}
            </span>
            <span className="text-gray-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBF8F2] border border-[#C3ECD8] text-[#287857] text-[10px] font-bold uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-[#287857] animate-pulse" />
              Live Marketplace
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Inquiries Acceptance Toggle for Vendors */}
            {user.role === 'VENDOR' && (
              <button
                type="button"
                onClick={() => setAcceptingInquiries(!acceptingInquiries)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider transition-all border ${
                  acceptingInquiries
                    ? 'bg-[#EBF8F2] text-[#287857] border-[#C3ECD8]'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                <span className={`size-1.5 rounded-full ${acceptingInquiries ? 'bg-[#287857]' : 'bg-gray-400'}`} />
                {acceptingInquiries ? 'Accepting Leads' : 'Calendar Paused'}
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="size-8 rounded-lg border border-[#EFE3CF] bg-[#FAF5EC] hover:bg-[#F3EADB] flex items-center justify-center text-[#641E3D] transition-colors"
                title="Notifications"
              >
                <Bell className="size-3.5" />
                <span className="absolute -top-1 -right-1 size-3.5 bg-[#B63A4A] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#EFE3CF]">
              <div className="size-7 rounded-lg bg-[#641E3D] text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-[#2A121E] leading-none truncate max-w-[130px]">{user.name}</p>
                <p className="text-[9px] text-[#8A6A23] font-bold uppercase tracking-wider mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
