'use client';

/**
 * withAuth — Higher-Order Component for role-based route protection.
 *
 * Usage:
 *   export default withAuth(MyPage, ["OFFICIAL", "ASHA"]);
 *
 * - If the user is not logged in → redirect to /login
 * - If the user's role is not in allowedRoles → redirect to /
 * - While auth is loading → show a spinner
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles: UserRole[]
) {
    const ProtectedComponent = (props: P) => {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (isLoading) return;

            if (!user) {
                router.replace("/login");
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                router.replace("/");
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted-foreground text-sm">Verifying access…</p>
                    </div>
                </div>
            );
        }

        if (!user || !allowedRoles.includes(user.role)) {
            return null; // router.replace is in flight
        }

        return <WrappedComponent {...props} />;
    };

    ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;
    return ProtectedComponent;
}

/**
 * Imperative helper — use inside event handlers or server-side checks.
 * Returns the current role stored in localStorage, or null.
 */
export function checkUserRole(): UserRole | null {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem("role") as UserRole) ?? null;
}
