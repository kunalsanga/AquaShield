"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WaterQualityForm({ onPredict }: { onPredict: (data: any) => void }) {
    const [formData, setFormData] = useState({
        ph: 7.0,
        turbidity: 5.0,
        temperature: 25.0,
        dissolved_oxygen: 7.5,
        bod: 2.0,
        coliform: 50.0,
        rainfall: 0.0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/predict/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            onPredict(result);
        } catch (error) {
            console.error("Prediction failed:", error);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Water Quality Input</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="ph">pH Level</Label>
                            <Input id="ph" name="ph" type="number" step="0.1" value={formData.ph} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                            <Input id="turbidity" name="turbidity" type="number" step="0.1" value={formData.turbidity} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="temperature">Temp (°C)</Label>
                            <Input id="temperature" name="temperature" type="number" step="0.1" value={formData.temperature} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="coliform">Coliform</Label>
                            <Input id="coliform" name="coliform" type="number" step="1" value={formData.coliform} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="bod">BOD</Label>
                            <Input id="bod" name="bod" type="number" step="0.1" value={formData.bod} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="do">Dissolved Oxygen</Label>
                            <Input id="dissolved_oxygen" name="dissolved_oxygen" type="number" step="0.1" value={formData.dissolved_oxygen} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="rainfall">Rainfall (mm)</Label>
                            <Input id="rainfall" name="rainfall" type="number" step="0.1" value={formData.rainfall} onChange={handleChange} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Analyze Risk</Button>
                </form>
            </CardContent>
        </Card>
    );
}
