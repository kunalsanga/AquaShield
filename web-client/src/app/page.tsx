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
        <div className="flex flex-col min-h-screen relative">
            <WaterBackground />
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight mb-6 text-balance">
                        Smart Early Warning System for <br className="hidden sm:block" />
                        <span className="text-accent">Water-Borne Diseases</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 text-pretty">
                        Empowering communities with AI-driven insights to predict outbreaks, monitor water quality, and save lives in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                        {(!role || role === 'ASHA' || role === 'OFFICIAL') && (
                            <Link href="/report" className="w-full sm:w-auto block">
                                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto shadow-lg shadow-primary/25">
                                    Report Health Data
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                        {(!role || role === 'OFFICIAL') && (
                            <Link href="/dashboard" className="w-full sm:w-auto block">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary text-primary text-lg px-8 py-6 h-auto hover:bg-primary/10 bg-card/80 backdrop-blur-sm">
                                    View Live Dashboard
                                </Button>
                            </Link>
                        )}
                        {(role === 'PUBLIC') && (
                            <Link href="/awareness" className="w-full sm:w-auto block">
                                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto shadow-lg shadow-primary/25">
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
                        <h2 className="text-3xl font-bold text-foreground">Core Capabilities</h2>
                        <p className="mt-4 text-muted-foreground">Advanced technology protecting community health</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-primary bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-primary/10 p-4 rounded-full mb-4">
                                    <Activity className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">AI Outbreak Prediction</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Advanced machine learning models analyzing rainfall patterns and case data to forecast potential biological threats weeks in advance.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-accent bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-accent/10 p-4 rounded-full mb-4">
                                    <ShieldCheck className="w-8 h-8 text-accent" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">Real-time Water Monitoring</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Continuous surveillance of water quality metrics across districts to identify contamination sources instantly.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-destructive bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                                    <BarChart2 className="w-8 h-8 text-destructive" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">Early Warning Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Instant SMS and app notifications to local authorities and health workers when risk levels exceed safety thresholds.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
