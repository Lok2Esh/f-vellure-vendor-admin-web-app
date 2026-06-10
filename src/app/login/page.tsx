"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { setAuthSession, getRedirectPath } from "@/lib/auth";
import { Loader2, Mail, Lock, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DEMO_EMAIL || "");
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_DEMO_PASSWORD || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;

      // Persist session
      setAuthSession(token, user);

      // Role-based redirect
      const redirectPath = getRedirectPath(user.role);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left side: Branding/Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-burgundy text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-serif font-bold tracking-tight">Vellure</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gold font-medium mt-2">
            Luxury Concierge Portal
          </p>
        </div>
        
        <div className="relative z-10">
          <blockquote className="text-3xl font-serif italic text-white/90 leading-relaxed">
            "The secret of a great wedding is in the details, and the secret of details is in the management."
          </blockquote>
          <p className="mt-4 text-gold font-medium">— Vellure Excellence Team</p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/20 blur-3xl" />
      </div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center p-8 bg-champagne">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-500 text-sm">Sign in to manage your luxury ecosystem</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-burgundy transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-burgundy text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-burgundy/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Portal
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-sm text-gray-400">New to Vellure? </span>
              <Link href="/register" className="text-sm font-bold text-gold hover:text-burgundy transition-colors">
                Apply for Partnership
              </Link>
            </div>
          </form>
          
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium pt-4">
            Secured by Vellure Identity Service
          </p>
        </div>
      </div>
    </main>
  );
}
