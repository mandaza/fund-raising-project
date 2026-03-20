"use client";

import { GuestInfoFields, GuestFormData } from "@/components/forms/GuestInfoFields";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { GuestType } from "@/lib/types/booking";
import { BookingWizardErrors, BookingWizardFormState } from "./types";

interface Step2DetailsProps {
  form: BookingWizardFormState;
  errors: BookingWizardErrors;
  displayName: string;
  onGuestInfoChange: (field: keyof GuestFormData, value: string) => void;
  onFieldChange: (field: keyof BookingWizardFormState, value: string) => void;
}

export function Step2Details({
  form,
  errors,
  displayName,
  onGuestInfoChange,
  onFieldChange,
}: Step2DetailsProps) {
  const isCorporate = form.bookingType === GuestType.CORPORATE;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Share your details</h2>
        <p className="mt-2 text-gray-600">
          Thank you, <span className="font-semibold text-primary">{displayName} 💚</span>. We only ask for the details
          we need to confirm and support your booking.
        </p>
      </div>

      {isCorporate ? (
        <div className="space-y-6">
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Company details</h3>
              <p className="mt-1 text-sm text-gray-600">Tell us about the organisation reserving the table.</p>
            </div>

            <Input
              label="Company name"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={(value) => onFieldChange("companyName", value)}
              error={errors.companyName}
              required
              placeholder="Acme Corp"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Company email"
                name="companyEmail"
                type="email"
                value={form.companyEmail}
                onChange={(value) => onFieldChange("companyEmail", value)}
                error={errors.companyEmail}
                placeholder="accounts@company.com"
              />
              <Input
                label="Company phone"
                name="companyPhone"
                type="tel"
                value={form.companyPhone}
                onChange={(value) => onFieldChange("companyPhone", value)}
                error={errors.companyPhone}
                placeholder="+273 7x xxx xxxx"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact person</h3>
              <p className="mt-1 text-sm text-gray-600">We will use this person for updates about the booking.</p>
            </div>

            <Input
              label="Full name"
              name="contactName"
              type="text"
              value={form.contactName}
              onChange={(value) => onFieldChange("contactName", value)}
              error={errors.contactName}
              required
              placeholder="Jane Doe"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email address"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(value) => onFieldChange("contactEmail", value)}
                error={errors.contactEmail}
                placeholder="jane.doe@company.com"
                helpText="Optional - We will send updates here if provided."
              />
              <Input
                label="Phone number"
                name="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={(value) => onFieldChange("contactPhone", value)}
                error={errors.contactPhone}
                placeholder="+263 7x xxx xxxx"
                helpText="Optional - We may contact you about your booking."
              />
            </div>
          </section>
        </div>
      ) : (
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Guest information</h3>
            <p className="mt-1 text-sm text-gray-600">These details will be used for your reservation and updates.</p>
          </div>

          <GuestInfoFields
            formData={{
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
            }}
            onChange={onGuestInfoChange}
            errors={{
              fullName: errors.fullName,
              email: errors.email,
              phone: errors.phone,
            }}
          />
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Additional notes</h3>
          <p className="mt-1 text-sm text-gray-600">Share any preferences or details that may help us support you.</p>
        </div>

        <TextArea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={(value) => onFieldChange("notes", value)}
          error={errors.notes}
          placeholder={
            isCorporate
              ? "Any special requirements, seating preferences, or recognition notes?"
              : "Any dietary restrictions or accessibility requirements?"
          }
          rows={4}
          maxLength={500}
        />
      </section>
    </div>
  );
}
