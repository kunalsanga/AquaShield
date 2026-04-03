import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, ShieldCheck, Activity } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 tracking-tight mb-6">
                        Smart Early Warning System for <br className="hidden sm:block" />
                        <span className="text-blue-600">Water-Borne Diseases</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10">
                        Empowering communities with AI-driven insights to predict outbreaks, monitor water quality, and save lives in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/report">
                            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
                                Report Health Data
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 text-lg px-8 py-6 h-auto hover:bg-blue-50">
                                View Live Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Core Capabilities</h2>
                        <p className="mt-4 text-gray-600">Advanced technology protecting community health</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition-shadow border-t-4 border-blue-500">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-blue-100 p-4 rounded-full mb-4">
                                    <Activity className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">AI Outbreak Prediction</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-gray-600">
                                Advanced machine learning models analyzing rainfall patterns and case data to forecast potential biological threats weeks in advance.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-t-4 border-teal-500">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-teal-100 p-4 rounded-full mb-4">
                                    <ShieldCheck className="w-8 h-8 text-teal-600" />
                                </div>
                                <CardTitle className="text-xl">Real-time Water Monitoring</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-gray-600">
                                Continuous surveillance of water quality metrics across districts to identify contamination sources instantly.
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-t-4 border-red-500">
                            <CardHeader className="flex flex-col items-center">
                                <div className="bg-red-100 p-4 rounded-full mb-4">
                                    <BarChart2 className="w-8 h-8 text-red-600" />
                                </div>
                                <CardTitle className="text-xl">Early Warning Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-gray-600">
                                Instant SMS and app notifications to local authorities and health workers when risk levels exceed safety thresholds.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
