'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Activity, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Report Case", href: "/report" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Alerts", href: "/alerts" },
        { name: "Awareness", href: "/awareness" },
    ];

    return (
        <nav className="bg-white shadow-md w-full z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Droplets className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            AquaShield
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4">
                            <Link href="/report">
                                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                                    Report Data
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                    <Activity className="w-4 h-4 mr-2" />
                                    Live Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="mt-4 flex flex-col gap-3">
                            <Link href="/report" onClick={() => setIsOpen(false)} className="w-full block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Report Health Data
                                </Button>
                            </Link>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full block">
                                <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                                    <Activity className="w-4 h-4 mr-2" />
                                    View Live Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
