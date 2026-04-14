'use client';

import { useState, FormEvent, useEffect } from "react";
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
    const [isWarmingUp, setIsWarmingUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const warmup = async () => {
            setIsWarmingUp(true);
            try {
                await authApi.warmup();
            } catch {
                // Ignore warmup failures; real auth call will show actual errors.
            } finally {
                if (mounted) setIsWarmingUp(false);
            }
        };
        warmup();
        return () => {
            mounted = false;
        };
    }, []);

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
            login(res.email, res.access_token, res.role as UserRole, res.assigned_region || "Sambalpur");
            router.push(roleRedirectMap[res.role as UserRole] ?? "/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl mb-4">
                            <Droplets className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                        <p className="text-muted-foreground text-sm mt-1">Sign in to AquaShield</p>
                        {isWarmingUp && (
                            <p className="text-xs text-muted-foreground mt-2">Preparing server connection...</p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">
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
                                    className="w-full bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in (server may take a few seconds)...
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
                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Role info chips */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
                    {[
                        { role: "ASHA", color: "emerald", desc: "Report Data" },
                        { role: "OFFICIAL", color: "purple", desc: "Full Access" },
                        { role: "PUBLIC", color: "sky", desc: "Awareness" },
                    ].map(({ role, color, desc }) => (
                        <div
                            key={role}
                            className={`bg-muted/50 border border-border rounded-xl py-2.5 px-2`}
                        >
                            <span className="text-primary font-semibold block">{role}</span>
                            <span>{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
