"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { PaymentMethodInfo } from "@/lib/types/payment";

export interface PaymentMethodCardProps {
  method: PaymentMethodInfo;
  selected?: boolean;
  onSelect?: () => void;
}

export function PaymentMethodCard({ method, selected = false, onSelect }: PaymentMethodCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary" : "hover:shadow-lg"
      }`}
      padding="md"
    >
      <div onClick={() => onSelect?.()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{method.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{method.title}</h3>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-primary hover:text-primary-dark"
          >
            <svg
              className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Payment Details:</h4>
          <ul className="space-y-2">
            {method.details.map((detail, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <svg
                  className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          {copied && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Copied to clipboard!
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
