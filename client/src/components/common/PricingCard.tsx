import { Check } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
}

export function PricingCard({
    title,
    price,
    description,
    features,
    buttonText,
    popular,
}: PricingCardProps) {
    return (
        <Card
            className={`relative h-full transition-all rounded-lg duration-300 hover:-translate-y-2 ${popular
                    ? "border-blue-600 shadow-xl scale-105"
                    : "border-border"
                }`}
        >
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium">
                        Most Popular
                    </span>
                </div>
            )}

            <CardContent className="p-8 flex flex-col h-full">
                <div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-muted-foreground mt-2">
                        {description}
                    </p>

                    <div className="mt-6">
                        <span className="text-5xl font-bold">{price}</span>
                        <span className="text-muted-foreground ml-2">
                            /month
                        </span>
                    </div>
                </div>

                <div className="space-y-4 my-8 flex-1">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-3"
                        >
                            <Check className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <Button
                    size="lg"
                    className={cn("w-full rounded-full", popular && "bg-blue-600 hover:bg-blue-500")}
                    variant={popular ? "default" : "outline"}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}