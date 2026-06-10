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
  Grid,
  Tag,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthSession, UserRole } from "@/lib/auth";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Verification Queue", href: "/admin/queue", icon: ClipboardList },
    { name: "All Vendors", href: "/admin/vendors", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Grid },
    { name: "Offers", href: "/admin/offers", icon: Tag },
    { name: "Packages", href: "/admin/packages", icon: Package },
  ];

  const vendorLinks = [
    { name: "My Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/vendor/profile", icon: UserCircle },
    { name: "My Portfolio", href: "/vendor/portfolio", icon: ImageIcon },
  ];

  const links = role === "ADMIN" ? adminLinks : vendorLinks;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0">
      {/* Brand Header */}
      <div className="p-8">
        <h1 className="text-2xl font-serif font-bold text-burgundy tracking-tight">
          Vellure
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium mt-1">
          Concierge Portal
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-burgundy/5 text-burgundy" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className={cn("w-5 h-5", isActive ? "text-burgundy" : "text-gray-400 group-hover:text-gray-600")} />
                {link.name}
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-50 mt-auto">
        <div className="px-4 py-3 mb-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Logged in as</p>
          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-bold",
            role === "ADMIN" ? "bg-burgundy text-white" : "bg-gold text-white"
          )}>
            {role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
