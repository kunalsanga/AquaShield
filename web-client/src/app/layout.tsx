import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "AquaShield | Community Health Monitoring",
    description: "Smart Early Warning System for Water-Borne Diseases",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#0c5a8a",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} font-sans min-h-screen min-h-dvh flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-300`}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                    <Navbar />
                    <main className="relative flex-1 w-full z-10">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                            {children}
                        </div>
                    </main>
                    <footer className="relative z-10 mt-auto border-t border-border/60 bg-card/80 backdrop-blur-md">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                            <p className="text-center text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                &copy; {new Date().getFullYear()} AquaShield. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
