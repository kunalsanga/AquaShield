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
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-sm w-full shadow-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Account Created!</h2>
                    <p className="text-muted-foreground text-sm">Redirecting you to login…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-lg">
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl mb-4">
                            <Droplets className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                        <p className="text-muted-foreground text-sm mt-1">Join AquaShield to protect community health</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
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
                                                : "border-border bg-card hover:bg-accent"
                                        }`}
                                    >
                                        <span className={`${r.accent} flex-shrink-0`}>{r.icon}</span>
                                        <div>
                                            <span className={`font-semibold text-sm ${role === r.value ? r.accent : "text-foreground"}`}>
                                                {r.label}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
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
                            <label htmlFor="register-email" className="block text-sm font-medium text-foreground mb-1.5">
                                Email address
                            </label>
                            <input
                                id="register-email"
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
                            <label htmlFor="register-password" className="block text-sm font-medium text-foreground mb-1.5">
                                Password
                                <span className="text-muted-foreground font-normal ml-1">(min. 8 characters)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="register-confirm" className="block text-sm font-medium text-foreground mb-1.5">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className={`w-full bg-background border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                                    confirmPassword && confirmPassword !== password
                                        ? "border-destructive/50 focus:ring-destructive/20"
                                        : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                                }`}
                                required
                            />
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-destructive text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground bg-primary hover:bg-primary/90`}
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
                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
