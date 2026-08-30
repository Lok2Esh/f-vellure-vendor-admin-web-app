"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserCircle, 
  Image as ImageIcon, 
  LogOut,
  ChevronRight,
  MessageSquareText,
  CalendarDays,
  Star,
  Sliders,
  Store,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
  IndianRupee,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthSession, setAuthSession, UserRole } from "@/lib/auth";
import { DEMO_VENDORS } from "@/lib/mockData";
import { useState } from "react";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  const handleQuickSwitch = (vendorId: string) => {
    if (vendorId === 'ADMIN') {
      setAuthSession('mock_admin_token', {
        id: 'admin_1',
        name: 'Vellure Super Admin',
        email: 'admin@vellure.com',
        role: 'ADMIN',
      });
      router.push('/admin/dashboard');
    } else {
      const v = DEMO_VENDORS.find(v => v.id === vendorId);
      if (v) {
        setAuthSession(`mock_token_${v.id}`, {
          id: v.id,
          name: v.businessName,
          email: v.email,
          role: 'VENDOR',
        });
        router.push('/vendor/dashboard');
      }
    }
    setShowSwitchMenu(false);
  };

  const adminLinks = [
    { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Verification Queue", href: "/admin/queue", icon: ShieldCheck, badge: "3 PENDING" },
    { name: "All Partners", href: "/admin/vendors", icon: Users },
    { name: "Global Inquiries", href: "/admin/inquiries", icon: MessageSquareText },
  ];

  const vendorLinks = [
    { name: "Atelier Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Profile & Services", href: "/vendor/profile", icon: Store },
    { name: "Work History & Portfolio", href: "/vendor/portfolio", icon: Sparkles },
    { name: "Leads & Quotes", href: "/vendor/inquiries", icon: MessageSquareText, badge: "2 NEW" },
    { name: "Calendar & Bookings", href: "/vendor/calendar", icon: CalendarDays },
    { name: "Reviews & Reputation", href: "/vendor/reviews", icon: Star },
    { name: "Atelier Settings", href: "/vendor/settings", icon: Sliders },
  ];

  const links = role === "ADMIN" ? adminLinks : vendorLinks;

  return (
    <aside className="w-64 h-screen bg-[#1F0E17] text-white/90 border-r border-[#3A1D2B] flex flex-col sticky top-0 shrink-0 select-none z-40">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#3A1D2B]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border border-[#D2AD6B]/40 bg-[#D2AD6B]/10 text-[#D2AD6B]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h1 className="text-xl font-serif font-bold text-white tracking-tight leading-none">
                Vellure
              </h1>
              <p className="text-[8px] uppercase tracking-[0.28em] text-[#D2AD6B] font-bold mt-1">
                {role === 'ADMIN' ? 'Super Admin HQ' : 'Partner Atelier'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#A48F97]">
          Navigation
        </p>

        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                isActive 
                  ? "bg-[#641E3D] text-white shadow-sm border border-[#8C2E58]" 
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <link.icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-[#E8CF9F]" : "text-[#A48F97] group-hover:text-white")} />
                <span className="truncate">{link.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase tracking-wider bg-[#D2AD6B]/20 text-[#E8CF9F] border border-[#D2AD6B]/30">
                    {link.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="size-3.5 text-[#E8CF9F]" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User & Quick-Switch Footer */}
      <div className="p-3 border-t border-[#3A1D2B] bg-[#170911]/90">
        {/* Quick Switch Dropdown */}
        <div className="relative mb-2">
          <button
            type="button"
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-[#E8CF9F] transition-all"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="size-3" />
              Switch Account Demo
            </span>
            <span className="text-[8px] opacity-60">▼</span>
          </button>

          {showSwitchMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-[#29131F] border border-[#4D283B] rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
              <p className="px-2 py-1 text-[8.5px] font-bold uppercase tracking-widest text-[#A48F97]">Select Persona</p>
              
              <button
                type="button"
                onClick={() => handleQuickSwitch('ADMIN')}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-white flex items-center justify-between"
              >
                <span>👑 Super Admin HQ</span>
                <span className="text-[9px] text-[#D2AD6B]">HQ</span>
              </button>

              {DEMO_VENDORS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleQuickSwitch(v.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 text-white/90 flex items-center justify-between truncate"
                >
                  <span className="truncate">{v.businessName}</span>
                  <span className="text-[9px] text-[#A48F97] ml-2 shrink-0">{v.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current User Card */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-[11px] font-bold text-white truncate leading-tight">{userName}</p>
            <p className="text-[9px] text-[#D2AD6B] font-semibold uppercase tracking-wider">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
