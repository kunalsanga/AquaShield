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

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#0f172a",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} min-h-screen min-h-dvh flex flex-col bg-gradient-to-br from-slate-50 via-white to-sky-50/60 text-slate-800 antialiased selection:bg-sky-200 selection:text-sky-900`}
            >
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1 w-full">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                            {children}
                        </div>
                    </main>
                    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-sm">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                            <p className="text-center text-xs sm:text-sm text-slate-500 leading-relaxed">
                                &copy; {new Date().getFullYear()} AquaShield. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
