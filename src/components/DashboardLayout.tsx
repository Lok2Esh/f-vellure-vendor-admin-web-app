"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getAuthUser, User, UserRole, isAuthenticated } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      router.push("/login"); // Or a forbidden page
      return;
    }

    setUser(authUser);
    setLoading(false);
  }, [allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-champagne">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-burgundy mx-auto" />
          <p className="text-sm font-serif italic text-gray-500 font-medium">Entering Vellure Concierge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-champagne">
      <Sidebar role={user.role} userName={user.name} />
      <main className="flex-1 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
