"use client";

import { useEffect, useState } from 'react';
import WaterForm from '@/components/WaterForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
    const [prediction, setPrediction] = useState<any>(null);

    const handlePrediction = (data: any) => {
        setPrediction(data);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-50">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-4xl font-bold text-blue-600">Aquashield</h1>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <p>Community Health Monitoring System</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                <div className="lg:col-span-1">
                    <WaterForm onPredict={handlePrediction} />
                </div>
                <div className="lg:col-span-2">
                    <Dashboard riskData={prediction} />
                </div>
            </div>
        </main>
    );
}
