'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";
import type { UserRole } from "@/types";

// Role → redirect map
const roleRedirectMap: Record<UserRole, string> = {
    ASHA: "/report",
    OFFICIAL: "/dashboard",
    PUBLIC: "/awareness",
};

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.login({ email, password });
            login(res.email, res.access_token, res.role as UserRole);
            router.push(roleRedirectMap[res.role as UserRole] ?? "/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-4">
                            <Droplets className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to AquaShield</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Role info chips */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
                    {[
                        { role: "ASHA", color: "emerald", desc: "Report Data" },
                        { role: "OFFICIAL", color: "purple", desc: "Full Access" },
                        { role: "PUBLIC", color: "sky", desc: "Awareness" },
                    ].map(({ role, color, desc }) => (
                        <div
                            key={role}
                            className={`bg-${color}-900/30 border border-${color}-700/30 rounded-xl py-2.5 px-2`}
                        >
                            <span className={`text-${color}-400 font-semibold block`}>{role}</span>
                            <span>{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
