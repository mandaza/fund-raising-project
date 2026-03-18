"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { createCorporateBooking } from "@/lib/api/bookings";
import { GuestType } from "@/lib/types/booking";
import { validateEmail, validatePhone } from "@/lib/utils/validation";
import { PRICING } from "@/lib/utils/constants";

export function CorporateBookingForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [tables, setTables] = useState("1");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const clearFieldError = (field: string) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Company
    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (companyName.trim().length > 200) {
      newErrors.companyName = "Company name must be less than 200 characters";
    }

    if (companyEmail && !validateEmail(companyEmail)) {
      newErrors.companyEmail = "Please enter a valid company email address";
    }

    if (companyPhone && !validatePhone(companyPhone)) {
      newErrors.companyPhone = "Please enter a valid company phone number";
    }

    // Contact person
    if (!contactName.trim()) {
      newErrors.contactName = "Contact person name is required";
    } else if (contactName.trim().length > 200) {
      newErrors.contactName = "Contact person name must be less than 200 characters";
    }

    if (contactEmail && !validateEmail(contactEmail)) {
      newErrors.contactEmail = "Please enter a valid contact email address";
    }

    if (contactPhone && !validatePhone(contactPhone)) {
      newErrors.contactPhone = "Please enter a valid contact phone number";
    }

    // Validate tables
    const tablesNum = parseInt(tables);
    if (isNaN(tablesNum) || tablesNum < 1 || tablesNum > 500) {
      newErrors.tables = "Number of tables must be between 1 and 500";
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
      const companyBlock = [
        `Company: ${companyName.trim()}`,
        companyEmail.trim() ? `Company Email: ${companyEmail.trim()}` : null,
        companyPhone.trim() ? `Company Phone: ${companyPhone.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const contactBlock = [
        `Contact Person: ${contactName.trim()}`,
        contactEmail.trim() ? `Contact Email: ${contactEmail.trim()}` : null,
        contactPhone.trim() ? `Contact Phone: ${contactPhone.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const notesBlock = notes.trim() ? `Notes: ${notes.trim()}` : null;
      const combinedNotes = [companyBlock, contactBlock, notesBlock].filter(Boolean).join("\n\n") || undefined;

      const response = await createCorporateBooking({
        guest: {
          full_name: contactName.trim(),
          email: contactEmail.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          guest_type: GuestType.CORPORATE,
        },
        tables: parseInt(tables),
        notes: combinedNotes,
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

  const tablesNum = parseInt(tables) || 0;
  const totalSeats = tablesNum * PRICING.SEATS_PER_TABLE;
  const totalPrice = tablesNum * PRICING.CORPORATE_TABLE;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && <Alert type="error" message={apiError} dismissible onClose={() => setApiError(null)} />}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
        <div className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            type="text"
            value={companyName}
            onChange={(value) => {
              setCompanyName(value);
              clearFieldError("companyName");
            }}
            error={errors.companyName}
            required
            placeholder="e.g. ABC Holdings"
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Email"
              name="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(value) => {
                setCompanyEmail(value);
                clearFieldError("companyEmail");
              }}
              error={errors.companyEmail}
              placeholder="accounts@company.com"
              disabled={isSubmitting}
            />
            <Input
              label="Company Phone"
              name="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(value) => {
                setCompanyPhone(value);
                clearFieldError("companyPhone");
              }}
              error={errors.companyPhone}
              placeholder="078xxxxxxx"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Person Details</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="contactName"
            type="text"
            value={contactName}
            onChange={(value) => {
              setContactName(value);
              clearFieldError("contactName");
            }}
            error={errors.contactName}
            required
            placeholder="John Doe"
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(value) => {
                setContactEmail(value);
                clearFieldError("contactEmail");
              }}
              error={errors.contactEmail}
              placeholder="john.doe@company.com"
              helpText="Optional - We'll send booking confirmation to this email"
              disabled={isSubmitting}
            />
            <Input
              label="Phone Number"
              name="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(value) => {
                setContactPhone(value);
                clearFieldError("contactPhone");
              }}
              error={errors.contactPhone}
              placeholder="+263 7x xxx xxxx"
              helpText="Optional - We may contact you for booking updates"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
        <div className="space-y-4">
          <Input
            label="Number of Tables"
            name="tables"
            type="number"
            value={tables}
            onChange={setTables}
            error={errors.tables}
            required
            min={1}
            max={500}
            placeholder="1"
            helpText={`Each table seats ${PRICING.SEATS_PER_TABLE} guests`}
            disabled={isSubmitting}
          />

          {tablesNum > 0 && (
            <div className="bg-primary/10 border border-primary/25 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-neutral-dark">Total Seats</p>
                  <p className="text-2xl font-bold text-primary">{totalSeats}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-dark">Total Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ${totalPrice} {PRICING.CURRENCY}
                  </p>
                </div>
              </div>
            </div>
          )}

          <TextArea
            label="Additional Notes"
            name="notes"
            value={notes}
            onChange={setNotes}
            error={errors.notes}
            placeholder="Any special requirements or seating preferences?"
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
