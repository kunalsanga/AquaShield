'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Droplets, Eye, EyeOff, UserPlus, AlertCircle,
    Loader2, CheckCircle2, Stethoscope, Building2, Users
} from "lucide-react";
import { authApi } from "@/lib/api";
import type { UserRole } from "@/types";

interface RoleOption {
    value: UserRole;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    accent: string;
}

const ROLES: RoleOption[] = [
    {
        value: "ASHA",
        label: "ASHA Worker",
        description: "Submit water quality reports and health data",
        icon: <Stethoscope className="w-5 h-5" />,
        color: "border-emerald-500/40 bg-emerald-500/10",
        accent: "text-emerald-400",
    },
    {
        value: "OFFICIAL",
        label: "Health Official",
        description: "Full dashboard, alert management & all reports",
        icon: <Building2 className="w-5 h-5" />,
        color: "border-purple-500/40 bg-purple-500/10",
        accent: "text-purple-400",
    },
    {
        value: "PUBLIC",
        label: "Public User",
        description: "View health awareness and safety tips",
        icon: <Users className="w-5 h-5" />,
        color: "border-sky-500/40 bg-sky-500/10",
        accent: "text-sky-400",
    },
];

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("PUBLIC");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const selectedRole = ROLES.find((r) => r.value === role)!;

    const validate = (): string | null => {
        if (!email) return "Email is required.";
        if (!password) return "Password is required.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await authApi.register({ email, password, role });
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-slate-400 text-sm">Redirecting you to login…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-lg">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-4">
                            <Droplets className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create your account</h1>
                        <p className="text-slate-400 text-sm mt-1">Join AquaShield to protect community health</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Select your role
                            </label>
                            <div className="grid gap-3">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={`flex items-center gap-4 w-full border rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                                            role === r.value
                                                ? `${r.color} border-opacity-100`
                                                : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                        }`}
                                    >
                                        <span className={`${r.accent} flex-shrink-0`}>{r.icon}</span>
                                        <div>
                                            <span className={`font-semibold text-sm ${role === r.value ? r.accent : "text-white"}`}>
                                                {r.label}
                                            </span>
                                            <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                                        </div>
                                        {role === r.value && (
                                            <CheckCircle2 className={`w-4 h-4 ml-auto flex-shrink-0 ${r.accent}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="register-email"
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
                            <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                                <span className="text-slate-500 font-normal ml-1">(min. 8 characters)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="register-confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className={`w-full bg-white/5 border text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                                    confirmPassword && confirmPassword !== password
                                        ? "border-red-500/50 focus:ring-red-500/20"
                                        : "border-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                                }`}
                                required
                            />
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-white ${selectedRole.color.replace("bg-", "bg-").replace("border-", "")} bg-blue-600 hover:bg-blue-500 shadow-blue-600/25`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create Account as {role}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
