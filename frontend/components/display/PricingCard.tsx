import React from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { PRICING } from "@/lib/utils/constants";

export interface PricingCardProps {
  type: "individual" | "corporate";
  onSelect?: () => void;
  highlighted?: boolean;
}

export function PricingCard({ type, onSelect, highlighted = false }: PricingCardProps) {
  const isIndividual = type === "individual";

  const config = {
    individual: {
      title: "Individual Seat",
      price: PRICING.INDIVIDUAL_SEAT,
      features: [
        "Single seat reservation",
        "Fine dining experience",
        "Evening entertainment",
        "Support a noble cause",
      ],
      ctaText: "Book Individual Seat",
    },
    corporate: {
      title: "Corporate Table",
      price: PRICING.CORPORATE_TABLE,
      features: [
        `Full table (${PRICING.SEATS_PER_TABLE} seats)`,
        "Premium placement",
        "Company recognition",
        "Networking opportunities",
        "Fine dining experience",
        "Evening entertainment",
      ],
      ctaText: "Book Corporate Table",
    },
  };

  const { title, price, features, ctaText } = config[type];

  return (
    <Card
      className={`relative ${highlighted ? "ring-2 ring-primary shadow-lg" : ""}`}
      padding="lg"
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
          Popular
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

        <div className="mb-6">
          <span className="text-4xl font-bold text-primary">${price}</span>
          <span className="text-gray-600 ml-2">{PRICING.CURRENCY}</span>
          {!isIndividual && (
            <p className="text-sm text-gray-500 mt-1">
              ${price / PRICING.SEATS_PER_TABLE} per seat
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <svg
                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {onSelect && (
          <Button
            variant={highlighted ? "primary" : "outline"}
            size="lg"
            onClick={onSelect}
            className="w-full"
          >
            {ctaText}
          </Button>
        )}
      </div>
    </Card>
  );
}
