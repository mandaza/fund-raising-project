"use client";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { PAYMENT_METHODS, PRICING } from "@/lib/utils/constants";
import { BookingWizardDerivedState } from "./types";

interface Step4PaymentProps {
  derived: BookingWizardDerivedState;
}

export function Step4Payment({ derived }: Step4PaymentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
        <p className="mt-2 text-gray-600">
          Thank you, {derived.displayName}. When you continue, we will create your booking and take you to the payment
          instructions page.
        </p>
      </div>

      <Card className="bg-primary/10 border-primary/25">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Amount due</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              ${derived.totalPrice} {PRICING.CURRENCY}
            </p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-700">
            Minimum deposit:{" "}
            <span className="font-semibold text-gray-900">
              ${derived.minimumDeposit} {PRICING.CURRENCY}
            </span>
          </div>
        </div>
      </Card>

      <Alert
        type="info"
        title="What happens next"
        message="After creating the booking, you will receive a booking reference and be guided to upload your payment proof. Your reservation remains pending until payment is verified."
      />

      <Card>
        <h3 className="text-lg font-semibold text-gray-900">Available payment methods</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.method} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{method.title}</p>
              <p className="mt-2 text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
