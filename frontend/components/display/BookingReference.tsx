"use client";

import React, { useState } from "react";

export interface BookingReferenceProps {
  reference: string;
  label?: string;
}

export function BookingReference({ reference, label = "Booking Reference" }: BookingReferenceProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-primary/10 border-2 border-primary/25 rounded-lg p-6 text-center">
      <p className="text-sm font-medium text-neutral-dark mb-2">{label}</p>
      <div className="flex items-center justify-center space-x-3">
        <span className="text-3xl font-bold text-primary tracking-wider">{reference}</span>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-primary/15 rounded-lg transition-colors group"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg
              className="h-6 w-6 text-green-600"
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
          ) : (
            <svg
              className="h-6 w-6 text-primary group-hover:text-primary-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
      {copied && <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>}
      <p className="text-sm text-neutral-dark mt-4 font-medium">
        Thank you for supporting MOSH.
      </p>
      <p className="text-xs text-neutral-dark/70 mt-2">
        Your contribution is helping change lives. Save this reference for your records.
      </p>
    </div>
  );
}
