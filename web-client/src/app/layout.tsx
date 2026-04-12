import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AquaShield | Community Health Monitoring",
    description: "Smart Early Warning System for Water-Borne Diseases",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-800 antialiased`}
            >
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1 w-full">
                        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <p className="text-center text-sm text-slate-500">
                                &copy; {new Date().getFullYear()} AquaShield. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
