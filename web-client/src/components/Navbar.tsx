'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Activity, Droplets, LogOut, LogIn, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isLoading } = useAuth();
    const role = user?.role ?? null;

    const close = () => setIsOpen(false);

    // ── Role-based nav links ───────────────────────────────────────────────
    const roleLinks = () => {
        if (!role) {
            return [
                { name: "Home", href: "/" },
                { name: "Awareness", href: "/awareness" },
                { name: "Check Risk", href: "/check-risk" },
                { name: "Risk Map", href: "/map" },
                { name: "Community Stats", href: "/stats" },
            ];
        }

        const links = [{ name: "Home", href: "/" }];

        if (role === "ASHA") {
            links.push(
                { name: "Report Case", href: "/report" },
                { name: "Emergency Reporting", href: "/emergency-reporting" },
                { name: "My Reports", href: "/my-reports" }
            );
        }

        if (role === "OFFICIAL") {
            links.push(
                { name: "Dashboard", href: "/dashboard" },
                { name: "Cases", href: "/cases" },
                { name: "Alerts", href: "/alerts" },
                { name: "Report Case", href: "/report" }
            );
        }

        if (role === "PUBLIC") {
            links.push(
                { name: "Awareness", href: "/awareness" },
                { name: "Check Risk", href: "/check-risk" },
                { name: "Risk Map", href: "/map" },
                { name: "Community Stats", href: "/stats" }
            );
        }

        return links;
    };

    const navLinks = roleLinks();

    // ── Role badge colour ─────────────────────────────────────────────────
    const roleBadgeClass =
        role === "OFFICIAL"
            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            : role === "ASHA"
            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            : "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800";

    return (
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border w-full z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* ── Logo ───────────────────────────────────────────── */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <Droplets className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold tracking-tight">
                            AquaShield
                        </span>
                    </Link>

                    {/* ── Desktop Menu ───────────────────────────────────── */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {!isLoading && (
                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        {/* Role badge */}
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeClass}`}>
                                            {role}
                                        </span>

                                        {/* User email */}
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="max-w-[140px] truncate">{user.email}</span>
                                        </div>

                                        {/* Logout */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={logout}
                                            className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>

                                        {/* CTA for ASHA */}
                                        {role === "ASHA" && (
                                            <Link href="/report">
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                    Report Data
                                                </Button>
                                            </Link>
                                        )}

                                        {/* CTA for OFFICIAL */}
                                        {role === "OFFICIAL" && (
                                            <Link href="/dashboard">
                                                <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 gap-1.5">
                                                    <Activity className="w-4 h-4" />
                                                    Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/login">
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className="pl-4 border-l border-border/40 hidden md:flex items-center">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* ── Mobile Hamburger ───────────────────────────────── */}
                    <div className="flex items-center md:hidden gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground hover:text-primary focus:outline-none p-2"
                        >
                            <span className="sr-only">Toggle menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Drawer ─────────────────────────────────────────── */}
            {isOpen && (
                <div className="md:hidden bg-background border-t border-border absolute w-full shadow-lg z-50">
                    <div className="px-4 pt-2 pb-5 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
                                onClick={close}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-border flex flex-col gap-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-1">
                                        <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadgeClass}`}>
                                            {role}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { logout(); close(); }}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login" onClick={close}>
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 gap-1.5">
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
