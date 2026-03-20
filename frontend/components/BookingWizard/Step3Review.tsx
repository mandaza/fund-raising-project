"use client";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { PRICING } from "@/lib/utils/constants";
import { GuestType } from "@/lib/types/booking";
import { BookingWizardDerivedState, BookingWizardFormState } from "./types";

interface Step3ReviewProps {
  form: BookingWizardFormState;
  derived: BookingWizardDerivedState;
}

export function Step3Review({ form, derived }: Step3ReviewProps) {
  const isCorporate = form.bookingType === GuestType.CORPORATE;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review your booking</h2>
        <p className="mt-2 text-gray-600">
          Thank you, {derived.displayName}. Please confirm everything looks right before continuing to payment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Booking summary</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between gap-4">
              <span>Booking type</span>
              <span className="font-medium text-gray-900">
                {isCorporate ? "Corporate table" : "Individual seat"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Seats reserved</span>
              <span className="font-medium text-gray-900">{derived.totalSeats}</span>
            </div>
            {isCorporate && (
              <div className="flex justify-between gap-4">
                <span>Tables reserved</span>
                <span className="font-medium text-gray-900">{derived.tablesCount}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span>Total amount</span>
              <span className="font-medium text-gray-900">
                ${derived.totalPrice} {PRICING.CURRENCY}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Minimum deposit</span>
              <span className="font-medium text-gray-900">
                ${derived.minimumDeposit} {PRICING.CURRENCY}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-primary/10 border-primary/25">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Impact</p>
          <p className="mt-3 text-lg font-semibold text-gray-900">{derived.impactMessage}</p>
          <p className="mt-2 text-gray-700">
            Your booking helps fund therapy, family support, and inclusive community programs for children with
            special needs.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isCorporate ? (
          <>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900">Company details</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Company:</span> {form.companyName}
                </p>
                {form.companyEmail && (
                  <p>
                    <span className="font-medium text-gray-900">Company email:</span> {form.companyEmail}
                  </p>
                )}
                {form.companyPhone && (
                  <p>
                    <span className="font-medium text-gray-900">Company phone:</span> {form.companyPhone}
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900">Contact details</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Contact person:</span> {form.contactName}
                </p>
                {form.contactEmail && (
                  <p>
                    <span className="font-medium text-gray-900">Email:</span> {form.contactEmail}
                  </p>
                )}
                {form.contactPhone && (
                  <p>
                    <span className="font-medium text-gray-900">Phone:</span> {form.contactPhone}
                  </p>
                )}
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Guest details</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">Full name:</span> {form.fullName}
              </p>
              {form.email && (
                <p>
                  <span className="font-medium text-gray-900">Email:</span> {form.email}
                </p>
              )}
              {form.phone && (
                <p>
                  <span className="font-medium text-gray-900">Phone:</span> {form.phone}
                </p>
              )}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          <p className="mt-4 text-sm text-gray-700">
            {form.notes.trim() || "No additional notes provided."}
          </p>
        </Card>
      </div>

      <Alert
        type="info"
        title="Donation support"
        message="Optional donations and multi-seat individual bookings are scoped for a later phase so this flow stays aligned with the current payment and booking system."
      />
    </div>
  );
}
