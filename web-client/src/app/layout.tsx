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
            <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
