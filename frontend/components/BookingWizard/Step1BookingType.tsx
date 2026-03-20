"use client";

import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { PRICING } from "@/lib/utils/constants";
import { GuestType } from "@/lib/types/booking";
import { BookingWizardErrors, BookingWizardFormState } from "./types";

interface Step1BookingTypeProps {
  form: BookingWizardFormState;
  errors: BookingWizardErrors;
  totalSeats: number;
  totalPrice: number;
  impactMessage: string;
  onSelectType: (type: GuestType.INDIVIDUAL | GuestType.CORPORATE) => void;
  onFieldChange: (field: keyof BookingWizardFormState, value: string) => void;
}

export function Step1BookingType({
  form,
  errors,
  totalSeats,
  totalPrice,
  impactMessage,
  onSelectType,
  onFieldChange,
}: Step1BookingTypeProps) {
  const bookingOptions: Array<{
    type: GuestType.INDIVIDUAL | GuestType.CORPORATE;
    title: string;
    description: string;
    summary: string;
  }> = [
    {
      type: GuestType.INDIVIDUAL,
      title: "Individual seat",
      description: "A simple way to support the event and reserve your place.",
      summary: `1 seat for $${PRICING.INDIVIDUAL_SEAT} ${PRICING.CURRENCY}`,
    },
    {
      type: GuestType.CORPORATE,
      title: "Corporate table",
      description: "Bring your team and make a larger impact together.",
      summary: `${PRICING.SEATS_PER_TABLE} seats per table for $${PRICING.CORPORATE_TABLE} ${PRICING.CURRENCY}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose your booking</h2>
        <p className="mt-2 text-gray-600">
          Start by selecting how you want to join the fundraiser. We will tailor the next steps to your booking type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bookingOptions.map((option) => {
          const isSelected = form.bookingType === option.type;

          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onSelectType(option.type)}
              aria-pressed={isSelected}
              className="text-left"
            >
              <Card
                className={`h-full border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{option.description}</p>
                    <p className="mt-4 text-sm font-medium text-primary">{option.summary}</p>
                  </div>
                  <span
                    className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isSelected ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </span>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {form.bookingType === GuestType.CORPORATE ? (
        <Card className="bg-white">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <Input
              label="Number of tables"
              name="tables"
              type="number"
              value={form.tables}
              onChange={(value) => onFieldChange("tables", value)}
              error={errors.tables}
              required
              min={1}
              max={500}
              placeholder="1"
              helpText={`Each table seats ${PRICING.SEATS_PER_TABLE} guests`}
            />

            <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
              <p className="text-sm font-medium text-gray-700">Booking summary</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Seats reserved</p>
                  <p className="text-3xl font-bold text-primary">{totalSeats}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ${totalPrice} {PRICING.CURRENCY}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-primary/10 border-primary/25">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Booking summary</p>
              <p className="mt-1 text-gray-700">1 seat reserved for the event</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              ${PRICING.INDIVIDUAL_SEAT} {PRICING.CURRENCY}
            </p>
          </div>
        </Card>
      )}

      <Card className="bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Impact</p>
        <p className="mt-3 text-lg font-semibold text-gray-900">{impactMessage}</p>
        <p className="mt-2 text-gray-600">
          Every booking supports children with special needs through therapy, caregiver support, and inclusive
          community programs.
        </p>
      </Card>
    </div>
  );
}
