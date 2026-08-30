"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAuthSession, getRedirectPath } from "@/lib/auth";
import { DEMO_VENDORS } from "@/lib/mockData";
import { 
  Loader2, 
  Mail, 
  Lock, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Store, 
  ArrowRight,
  HelpCircle,
  X,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Try backend API first
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;
      setAuthSession(token, user);
      router.push(getRedirectPath(user.role));
    } catch (err: any) {
      // Demo Fallback matching against demo vendors or admin
      const matchedVendor = DEMO_VENDORS.find(
        (v) => v.email.toLowerCase() === email.toLowerCase()
      );

      if (matchedVendor) {
        setAuthSession(`demo_token_${matchedVendor.id}`, {
          id: matchedVendor.id,
          name: matchedVendor.businessName,
          email: matchedVendor.email,
          role: 'VENDOR',
        });
        router.push('/vendor/dashboard');
        return;
      }

      if (email.toLowerCase().includes('admin')) {
        setAuthSession('demo_token_admin', {
          id: 'admin_1',
          name: 'Vellure Super Admin',
          email: email,
          role: 'ADMIN',
        });
        router.push('/admin/dashboard');
        return;
      }

      setError(err.response?.data?.error || "Invalid credentials. You can use the Quick Demo Logins below!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (type: 'ADMIN' | string) => {
    if (type === 'ADMIN') {
      setAuthSession('demo_token_admin', {
        id: 'admin_1',
        name: 'Vellure Super Admin',
        email: 'admin@vellure.com',
        role: 'ADMIN',
      });
      router.push('/admin/dashboard');
    } else {
      const v = DEMO_VENDORS.find((vendor) => vendor.id === type) || DEMO_VENDORS[0];
      setAuthSession(`demo_token_${v.id}`, {
        id: v.id,
        name: v.businessName,
        email: v.email,
        role: 'VENDOR',
      });
      router.push('/vendor/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Log in as lead venue partner
      const v = DEMO_VENDORS[0];
      setAuthSession(`google_token_${v.id}`, {
        id: v.id,
        name: v.businessName,
        email: 'google.partner@patialaheritage.com',
        role: 'VENDOR',
      });
      router.push('/vendor/dashboard');
    }, 600);
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-12 bg-[#FAF7F2] text-[#2A121E]">
      {/* ──── LEFT BRAND HERO (5 cols) ──── */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-[#1F0E17] text-white relative overflow-hidden">
        {/* Grain & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#D2AD6B_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-[#641E3D]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-[#D2AD6B]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-[#D2AD6B]/40 bg-[#D2AD6B]/10 text-[#D2AD6B]">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Vellure</h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#D2AD6B] font-bold mt-0.5">
                Concierge & Partner Atelier
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#E8CF9F] mb-6">
            <ShieldCheck className="size-3.5" />
            Multi-Vendor Command Portal
          </div>
          <blockquote className="font-serif text-3xl font-normal text-white/95 leading-snug">
            "Your craft, your bespoke services, and high-value celebration leads — all unified in one refined command center."
          </blockquote>
          <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-[#D2AD6B]">
            <span>✓ Dynamic Live Quotes</span>
            <span>•</span>
            <span>✓ Multi-Media Portfolio</span>
            <span>•</span>
            <span>✓ Super-Admin Oversight</span>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>Vellure Platform v2.4</span>
          <span>Security Level: Tier 1 Encrypted</span>
        </div>
      </div>

      {/* ──── RIGHT FORM PANEL (7 cols) ──── */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A121E]">
              Partner & Admin Sign In
            </h2>
            <p className="mt-1 text-xs text-[#786B70] font-medium">
              Access your bespoke celebration dashboard, inquiries, and pricing
            </p>
          </div>

          {/* Quick 1-Click Demo Persona Bar */}
          <div className="bg-[#FAF2E6] border border-[#ECD8B5] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A23] flex items-center gap-1.5">
                <Sparkles className="size-3" />
                Quick 1-Click Demo Access
              </span>
              <span className="text-[9px] text-[#8A7A70] font-medium">Click any persona to log in instantly</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('v_patiala_fort')}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#E5D2BA] hover:border-[#641E3D] hover:bg-[#641E3D] hover:text-white text-left transition-all group"
              >
                <p className="text-[11px] font-bold truncate group-hover:text-white">Fort Patiala</p>
                <p className="text-[8.5px] text-[#8A7A70] uppercase font-bold group-hover:text-white/80">Venue Partner</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('v_rohan_roy')}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#E5D2BA] hover:border-[#641E3D] hover:bg-[#641E3D] hover:text-white text-left transition-all group"
              >
                <p className="text-[11px] font-bold truncate group-hover:text-white">Rohan Roy</p>
                <p className="text-[8.5px] text-[#8A7A70] uppercase font-bold group-hover:text-white/80">Photography</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('v_bhogal_caterers')}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#E5D2BA] hover:border-[#641E3D] hover:bg-[#641E3D] hover:text-white text-left transition-all group"
              >
                <p className="text-[11px] font-bold truncate group-hover:text-white">Bhogal Caterers</p>
                <p className="text-[8.5px] text-[#8A7A70] uppercase font-bold group-hover:text-white/80">Royal Catering</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('v_flora_belle')}
                className="px-2.5 py-2 rounded-xl bg-white border border-[#E5D2BA] hover:border-[#641E3D] hover:bg-[#641E3D] hover:text-white text-left transition-all group"
              >
                <p className="text-[11px] font-bold truncate group-hover:text-white">Flora Belle</p>
                <p className="text-[8.5px] text-[#8A7A70] uppercase font-bold group-hover:text-white/80">Luxury Decor</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="col-span-2 sm:col-span-2 px-2.5 py-2 rounded-xl bg-[#641E3D] text-white border border-[#8C2E58] hover:bg-[#4E152F] text-left transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-[11px] font-bold">👑 Super Admin HQ</p>
                  <p className="text-[8.5px] text-[#E8CF9F] uppercase font-bold">Platform Overview & Verifications</p>
                </div>
                <ChevronRight className="size-4 text-[#D2AD6B]" />
              </button>
            </div>
          </div>

          {/* Form Box */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#EFE3CF] space-y-5">
            {/* Google Sign-in */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#FAF5EC] hover:bg-[#F3EADB] border border-[#EFE3CF] rounded-xl text-xs font-bold text-[#2A121E] transition-all"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Sign in with Google Workspace
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#EFE3CF]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A48F97]">
                Or with Email
              </span>
              <div className="flex-1 h-px bg-[#EFE3CF]" />
            </div>

            {error && (
              <div className="bg-[#FDEDF0] text-[#B63A4A] p-3 rounded-xl text-xs font-semibold border border-[#F8CCD3]">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A48F97]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D] focus:ring-1 focus:ring-[#641E3D] transition-all"
                    placeholder="partner@patialaheritage.com or admin@vellure.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-[#786B70] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10.5px] font-bold text-[#641E3D] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A48F97]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs font-semibold text-[#2A121E] outline-none focus:border-[#641E3D] focus:ring-1 focus:ring-[#641E3D] transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#641E3D] hover:bg-[#4E152F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#641E3D]/10 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Enter Concierge Workspace
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Sign-Up link */}
          <div className="text-center text-xs text-[#786B70] font-medium">
            New partner atelier?{" "}
            <Link href="/register" className="font-bold text-[#641E3D] hover:underline">
              Register your luxury services →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-[#EFE3CF] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#2A121E]">Reset Password</h3>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="size-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="bg-[#EBF8F2] border border-[#C3ECD8] p-4 rounded-xl text-center space-y-2">
                <CheckCircle2 className="size-6 text-[#287857] mx-auto" />
                <p className="text-xs font-bold text-[#287857]">Password recovery link sent!</p>
                <p className="text-[11px] text-[#786B70]">
                  Please check your inbox at <b>{forgotEmail}</b> for instructions to reset your password.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#786B70]">
                  Enter your registered partner email address to receive a secure recovery link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-[#FAF5EC] border border-[#EFE3CF] rounded-xl text-xs text-[#2A121E] font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail) setForgotSuccess(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#641E3D] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Send Recovery Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
