"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GuestInfoFields, GuestFormData } from "./GuestInfoFields";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { createIndividualBooking } from "@/lib/api/bookings";
import { GuestType } from "@/lib/types/booking";
import { validateEmail, validatePhone } from "@/lib/utils/validation";
import { PRICING } from "@/lib/utils/constants";

export function IndividualBookingForm() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState<GuestFormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGuestInfoChange = (field: keyof GuestFormData, value: string) => {
    setGuestInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate full name
    if (!guestInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (guestInfo.fullName.trim().length > 200) {
      newErrors.fullName = "Full name must be less than 200 characters";
    }

    // Validate email (optional but must be valid if provided)
    if (guestInfo.email && !validateEmail(guestInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone (optional but must be valid if provided)
    if (guestInfo.phone && !validatePhone(guestInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Validate notes
    if (notes && notes.length > 500) {
      newErrors.notes = "Notes must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createIndividualBooking({
        guest: {
          full_name: guestInfo.fullName.trim(),
          email: guestInfo.email.trim() || undefined,
          phone: guestInfo.phone.trim() || undefined,
          guest_type: GuestType.INDIVIDUAL,
        },
        notes: notes.trim() || undefined,
      });

      // Redirect to booking page with reference
      router.push(`/booking/${response.reference}`);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && <Alert type="error" message={apiError} dismissible onClose={() => setApiError(null)} />}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
        <GuestInfoFields
          formData={guestInfo}
          onChange={handleGuestInfoChange}
          errors={errors}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/25 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-neutral-dark">Individual Seat</p>
                <p className="text-xs text-neutral-dark/70">1 seat reserved</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-dark">Price</p>
                <p className="text-2xl font-bold text-primary">
                  ${PRICING.INDIVIDUAL_SEAT} {PRICING.CURRENCY}
                </p>
              </div>
            </div>
          </div>

          <TextArea
            label="Additional Notes"
            name="notes"
            value={notes}
            onChange={setNotes}
            error={errors.notes}
            placeholder="Any dietary restrictions or special requirements?"
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Creating Booking..." : "Continue to Payment"}
      </Button>
    </form>
  );
}
