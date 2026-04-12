'use client';

/**
 * Global authentication context for AquaShield.
 * Manages user state, login, logout, and role checks.
 * Wrap `<AuthProvider>` around the root layout body.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, UserRole } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, token: string, role: UserRole) => void;
    logout: () => void;
    checkRole: (requiredRoles: UserRole[]) => boolean;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Rehydrate from localStorage on first render
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role") as UserRole | null;

        if (token && email && role) {
            setUser({ token, email, role });
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((email: string, token: string, role: UserRole) => {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        setUser({ email, token, role });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setUser(null);
        router.push("/");
    }, [router]);

    const checkRole = useCallback(
        (requiredRoles: UserRole[]) => {
            if (!user) return false;
            return requiredRoles.includes(user.role);
        },
        [user]
    );

    const value = useMemo(
        () => ({ user, isLoading, login, logout, checkRole }),
        [user, isLoading, login, logout, checkRole]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}
