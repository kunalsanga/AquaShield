'use client';

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, ShieldCheck, Activity } from "lucide-react";
import WaterBackground from "@/components/WaterBackground";

export default function Home() {
    const { user } = useAuth();
    const role = user?.role;

    return (
        <div className="flex flex-col min-h-screen relative text-slate-900 dark:text-slate-100">
            <WaterBackground />
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
                    <div className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 shadow-sm dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                        Water Intelligence Platform
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 dark:text-blue-100 tracking-tight mb-6 text-balance">
                        Smart Early Warning System for <br className="hidden sm:block" />
                        <span className="text-blue-600 dark:text-blue-300">Water-Borne Diseases</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-700 dark:text-blue-100/85 max-w-2xl mb-10 text-pretty">
                        Empowering communities with AI-driven insights to predict outbreaks, monitor water quality, and save lives in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                        {(!role || role === 'ASHA' || role === 'OFFICIAL') && (
                            <Link href="/report" className="w-full sm:w-auto block">
                                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto shadow-lg shadow-blue-500/30">
                                    Report Health Data
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                        {(!role || role === 'OFFICIAL') && (
                            <Link href="/dashboard" className="w-full sm:w-auto block">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-300 text-blue-700 dark:text-blue-300 text-lg px-8 py-6 h-auto hover:bg-blue-100/70 dark:hover:bg-blue-900/30 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm">
                                    View Live Dashboard
                                </Button>
                            </Link>
                        )}
                        {(role === 'PUBLIC') && (
                            <Link href="/awareness" className="w-full sm:w-auto block">
                                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto shadow-lg shadow-blue-500/30">
                                    View Awareness Guide
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Core Capabilities</h2>
                        <p className="mt-4 text-slate-700 dark:text-blue-100/80">Advanced technology protecting community health</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 bg-white/85 dark:bg-slate-900/75 backdrop-blur-sm hover:-translate-y-1 border-blue-100 dark:border-blue-900/40">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                                    <Activity className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">AI Outbreak Prediction</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-slate-700 dark:text-slate-300">
                                Advanced machine learning models analyzing rainfall patterns and case data to forecast potential biological threats weeks in advance.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-cyan-500 bg-white/85 dark:bg-slate-900/75 backdrop-blur-sm hover:-translate-y-1 border-cyan-100 dark:border-cyan-900/40">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-4 rounded-full mb-4">
                                    <ShieldCheck className="w-8 h-8 text-cyan-600 dark:text-cyan-300" />
                                </div>
                                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Real-time Water Monitoring</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-slate-700 dark:text-slate-300">
                                Continuous surveillance of water quality metrics across districts to identify contamination sources instantly.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-blue-400 bg-white/85 dark:bg-slate-900/75 backdrop-blur-sm hover:-translate-y-1 border-blue-100 dark:border-blue-900/40">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                                    <BarChart2 className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Early Warning Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-slate-700 dark:text-slate-300">
                                Instant SMS and app notifications to local authorities and health workers when risk levels exceed safety thresholds.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
