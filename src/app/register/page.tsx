"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAuthSession, getRedirectPath } from "@/lib/auth";
import { Loader2, Mail, Lock, User, Phone, Briefcase, ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "VENDOR" as "VENDOR" | "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/register", formData);
      const { token, user } = response.data;

      // Persist session
      setAuthSession(token, user);

      // Role-based redirect
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex items-center justify-center p-8 bg-champagne">
        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Become a Partner</h2>
            <p className="mt-2 text-gray-500 text-sm">Join the luxury Vellure ecosystem today</p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                    <input
                      type="tel" required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                  <input
                    type="password" required minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Account Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold ${
                      formData.role === 'VENDOR' ? 'bg-burgundy text-white border-burgundy shadow-sm shadow-burgundy/15' : 'bg-white text-gray-700 border-gray-300 hover:border-burgundy/50 hover:bg-champagne/60 hover:text-burgundy'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    VENDOR
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold ${
                      formData.role === 'USER' ? 'bg-burgundy text-white border-burgundy shadow-sm shadow-burgundy/15' : 'bg-white text-gray-700 border-gray-300 hover:border-burgundy/50 hover:bg-champagne/60 hover:text-burgundy'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    USER
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-burgundy bg-burgundy text-white py-4 rounded-xl font-bold shadow-md shadow-burgundy/15 hover:border-[#5f0d2e] hover:bg-[#5f0d2e] hover:shadow-lg hover:shadow-burgundy/25 hover:-translate-y-0.5 transition-all mt-4 disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-600 disabled:shadow-none disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ChevronRight className="w-5 h-5" /></>}
            </button>

            <div className="text-center pt-2">
              <span className="text-sm text-gray-400">Already a partner? </span>
              <Link href="/login" className="rounded-sm text-sm font-bold text-burgundy underline decoration-gold/70 underline-offset-4 transition-colors hover:text-[#5f0d2e] hover:decoration-burgundy">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Branding/Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-burgundy text-white relative">
        <div className="z-10">
          <h1 className="text-4xl font-serif font-bold tracking-tight">Vellure</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-medium mt-2">Partner Excellence</p>
        </div>
        <div className="z-10">
          <blockquote className="text-3xl font-serif italic text-white/90 leading-relaxed">
            "Your professional journey in luxury wedding planning begins here. Manage your business with perfection."
          </blockquote>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-gold blur-3xl" />
        </div>
      </div>
    </main>
  );
}
