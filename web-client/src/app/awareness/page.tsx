import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Flame, Hand, Utensils, ShieldCheck } from "lucide-react";

export default function AwarenessPage() {
    const topics = [
        {
            title: "Safe Drinking Water",
            icon: <Droplet className="h-8 w-8 text-blue-500" />,
            content: "Always use filtered or boiled water for drinking. Ensure water storage containers are clean and covered.",
            color: "border-blue-500"
        },
        {
            title: "Hand Hygiene",
            icon: <Hand className="h-8 w-8 text-teal-500" />,
            content: "Wash hands with soap for at least 20 seconds before eating and after using the restroom.",
            color: "border-teal-500"
        },
        {
            title: "Boiling Practices",
            icon: <Flame className="h-8 w-8 text-orange-500" />,
            content: "Boil water for at least 1 minute to kill harmful bacteria and parasites effectively.",
            color: "border-orange-500"
        },
        {
            title: "Food Safety",
            icon: <Utensils className="h-8 w-8 text-green-500" />,
            content: "Avoid street food during monsoon season. Wash fruits and vegetables thoroughly with clean water.",
            color: "border-green-500"
        },
        {
            title: "Monsoon Precautions",
            icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
            content: "Avoid walking through stagnant water to prevent infections. Use mosquito nets to prevent vector-borne diseases.",
            color: "border-indigo-500"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Health Awareness & Prevention</h1>
                <p className="text-gray-500 mt-2">Essential guidelines to keep you and your community safe from water-borne diseases.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => (
                    <Card key={index} className={`hover:shadow-lg transition-shadow border-t-4 ${topic.color}`}>
                        <CardHeader className="flex flex-col items-center pb-2">
                            <div className="p-3 rounded-full bg-gray-50 mb-4">
                                {topic.icon}
                            </div>
                            <CardTitle className="text-xl font-bold text-center">{topic.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600">
                            {topic.content}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
