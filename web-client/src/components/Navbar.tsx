'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Activity, Droplets, LogOut, LogIn, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isLoading } = useAuth();
    const role = user?.role ?? null;

    const close = () => setIsOpen(false);

    // ── Role-based nav links ───────────────────────────────────────────────
    const roleLinks = () => {
        if (!role) return [{ name: "Awareness", href: "/awareness" }];

        const links = [{ name: "Home", href: "/" }];

        if (role === "ASHA") {
            links.push({ name: "Report Case", href: "/report" });
        }

        if (role === "OFFICIAL") {
            links.push(
                { name: "Dashboard", href: "/dashboard" },
                { name: "Alerts", href: "/alerts" },
                { name: "Report Case", href: "/report" }
            );
        }

        if (role === "PUBLIC") {
            links.push({ name: "Awareness", href: "/awareness" });
        }

        return links;
    };

    const navLinks = roleLinks();

    // ── Role badge colour ─────────────────────────────────────────────────
    const roleBadgeClass =
        role === "OFFICIAL"
            ? "bg-purple-100 text-purple-700 border border-purple-200"
            : role === "ASHA"
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-sky-100 text-sky-700 border border-sky-200";

    return (
        <nav className="bg-white shadow-md w-full z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* ── Logo ───────────────────────────────────────────── */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <Droplets className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            AquaShield
                        </span>
                    </Link>

                    {/* ── Desktop Menu ───────────────────────────────────── */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
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
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <UserCircle2 className="w-4 h-4 text-gray-400" />
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
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5">
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Mobile Hamburger ───────────────────────────────── */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                        >
                            <span className="sr-only">Toggle menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Drawer ─────────────────────────────────────────── */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50">
                    <div className="px-4 pt-2 pb-5 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={close}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-1">
                                        <UserCircle2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600 truncate">{user.email}</span>
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
