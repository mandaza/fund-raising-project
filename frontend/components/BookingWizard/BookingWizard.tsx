"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingStepper } from "./BookingStepper";
import { Step1BookingType } from "./Step1BookingType";
import { Step2Details } from "./Step2Details";
import { Step3Review } from "./Step3Review";
import { Step4Payment } from "./Step4Payment";
import { BookingWizardErrors, BookingWizardFormState } from "./types";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { createCorporateBooking, createIndividualBooking } from "@/lib/api/bookings";
import { BookingStatus, GuestType } from "@/lib/types/booking";
import { PRICING } from "@/lib/utils/constants";
import { validateEmail, validatePhone } from "@/lib/utils/validation";

interface BookingWizardProps {
  initialType?: string;
}

const STEPS = ["Seats", "Details", "Review", "Payment"];
const BOOKING_STEP_ERROR_FIELDS: Array<keyof BookingWizardErrors> = ["bookingType", "tables"];
const DETAIL_STEP_ERROR_FIELDS: Array<keyof BookingWizardErrors> = [
  "fullName",
  "email",
  "phone",
  "companyName",
  "companyEmail",
  "companyPhone",
  "contactName",
  "contactEmail",
  "contactPhone",
  "notes",
];

function getInitialBookingType(initialType?: string): GuestType.INDIVIDUAL | GuestType.CORPORATE {
  return initialType === GuestType.CORPORATE ? GuestType.CORPORATE : GuestType.INDIVIDUAL;
}

export function BookingWizard({ initialType }: BookingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<BookingWizardFormState>({
    bookingType: getInitialBookingType(initialType),
    tables: "1",
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<BookingWizardErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const derived = useMemo(() => {
    const tablesCount = Math.max(parseInt(form.tables || "0", 10) || 0, 0);
    const isCorporate = form.bookingType === GuestType.CORPORATE;
    const totalSeats = isCorporate ? tablesCount * PRICING.SEATS_PER_TABLE : 1;
    const totalPrice = isCorporate ? tablesCount * PRICING.CORPORATE_TABLE : PRICING.INDIVIDUAL_SEAT;
    const minimumDeposit = isCorporate ? PRICING.CORPORATE_MIN_DEPOSIT : PRICING.INDIVIDUAL_MIN_DEPOSIT;
    const displayName = isCorporate
      ? form.companyName.trim() || form.contactName.trim() || "friend"
      : form.fullName.trim() || "friend";
    const impactMessage = isCorporate
      ? tablesCount <= 1
        ? "Your table helps create a stronger support network for children and families."
        : `Your ${tablesCount} tables help grow support for children and families across the MOSH community.`
      : "Your seat helps fund therapy, awareness, and inclusive community programs.";

    return {
      tablesCount,
      totalSeats,
      totalPrice,
      minimumDeposit,
      impactMessage,
      displayName,
    };
  }, [form]);

  const clearFieldError = (field: keyof BookingWizardErrors) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field: keyof BookingWizardFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as keyof BookingWizardErrors);
    setApiError(null);
  };

  const handleSelectType = (bookingType: GuestType.INDIVIDUAL | GuestType.CORPORATE) => {
    setForm((prev) => ({ ...prev, bookingType }));
    clearFieldError("bookingType");
    clearFieldError("tables");
    setApiError(null);
  };

  const validateBookingStep = () => {
    const nextErrors: BookingWizardErrors = {};

    if (!form.bookingType) {
      nextErrors.bookingType = "Please choose a booking type.";
    }

    if (form.bookingType === GuestType.CORPORATE) {
      const tablesCount = parseInt(form.tables, 10);
      if (Number.isNaN(tablesCount) || tablesCount < 1 || tablesCount > 500) {
        nextErrors.tables = "Number of tables must be between 1 and 500.";
      }
    }

    setErrors((prev) => {
      const preserved = { ...prev };
      for (const field of BOOKING_STEP_ERROR_FIELDS) {
        delete preserved[field];
      }
      return { ...preserved, ...nextErrors };
    });
    return Object.keys(nextErrors).length === 0;
  };

  const validateDetailsStep = () => {
    const nextErrors: BookingWizardErrors = {};

    if (form.bookingType === GuestType.CORPORATE) {
      if (!form.companyName.trim()) {
        nextErrors.companyName = "Company name is required.";
      } else if (form.companyName.trim().length > 200) {
        nextErrors.companyName = "Company name must be less than 200 characters.";
      }

      if (form.companyEmail && !validateEmail(form.companyEmail)) {
        nextErrors.companyEmail = "Please enter a valid company email address.";
      }

      if (form.companyPhone && !validatePhone(form.companyPhone)) {
        nextErrors.companyPhone = "Please enter a valid company phone number.";
      }

      if (!form.contactName.trim()) {
        nextErrors.contactName = "Contact person name is required.";
      } else if (form.contactName.trim().length > 200) {
        nextErrors.contactName = "Contact person name must be less than 200 characters.";
      }

      if (form.contactEmail && !validateEmail(form.contactEmail)) {
        nextErrors.contactEmail = "Please enter a valid contact email address.";
      }

      if (form.contactPhone && !validatePhone(form.contactPhone)) {
        nextErrors.contactPhone = "Please enter a valid contact phone number.";
      }
    } else {
      if (!form.fullName.trim()) {
        nextErrors.fullName = "Full name is required.";
      } else if (form.fullName.trim().length > 200) {
        nextErrors.fullName = "Full name must be less than 200 characters.";
      }

      if (form.email && !validateEmail(form.email)) {
        nextErrors.email = "Please enter a valid email address.";
      }

      if (form.phone && !validatePhone(form.phone)) {
        nextErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (form.notes.length > 500) {
      nextErrors.notes = "Notes must be less than 500 characters.";
    }

    setErrors((prev) => {
      const preserved = { ...prev };
      for (const field of DETAIL_STEP_ERROR_FIELDS) {
        delete preserved[field];
      }
      return { ...preserved, ...nextErrors };
    });
    return Object.keys(nextErrors).length === 0;
  };

  const validateAllSteps = () => {
    const bookingValid = validateBookingStep();
    const detailsValid = validateDetailsStep();
    return { bookingValid, detailsValid };
  };

  const goToNextStep = () => {
    const isValid =
      currentStep === 0 ? validateBookingStep() : currentStep === 1 ? validateDetailsStep() : true;

    if (!isValid) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goToPreviousStep = () => {
    setApiError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (currentStep !== STEPS.length - 1) {
      goToNextStep();
      return;
    }

    const { bookingValid, detailsValid } = validateAllSteps();
    if (!bookingValid || !detailsValid) {
      setCurrentStep(bookingValid ? 1 : 0);
      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        form.bookingType === GuestType.CORPORATE
          ? await createCorporateBooking({
              guest: {
                full_name: form.contactName.trim(),
                email: form.contactEmail.trim() || undefined,
                phone: form.contactPhone.trim() || undefined,
                guest_type: GuestType.CORPORATE,
              },
              tables: derived.tablesCount,
              notes:
                [
                  [
                    `Company: ${form.companyName.trim()}`,
                    form.companyEmail.trim() ? `Company Email: ${form.companyEmail.trim()}` : null,
                    form.companyPhone.trim() ? `Company Phone: ${form.companyPhone.trim()}` : null,
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  [
                    `Contact Person: ${form.contactName.trim()}`,
                    form.contactEmail.trim() ? `Contact Email: ${form.contactEmail.trim()}` : null,
                    form.contactPhone.trim() ? `Contact Phone: ${form.contactPhone.trim()}` : null,
                  ]
                    .filter(Boolean)
                    .join("\n"),
                  form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
                ]
                  .filter(Boolean)
                  .join("\n\n") || undefined,
            })
          : await createIndividualBooking({
              guest: {
                full_name: form.fullName.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim() || undefined,
                guest_type: GuestType.INDIVIDUAL,
              },
              notes: form.notes.trim() || undefined,
            });

      const nextHref =
        response.status === BookingStatus.CONFIRMED
          ? `/booking/${response.reference}/confirmation`
          : `/booking/${response.reference}/payment`;
      router.push(nextHref);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextButtonLabel =
    currentStep === 0
      ? "Continue to details"
      : currentStep === 1
        ? "Review booking"
        : currentStep === 2
          ? "Continue to payment"
          : "Create booking and continue";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BookingStepper currentStep={currentStep} steps={STEPS} />

      {apiError && <Alert type="error" message={apiError} dismissible onClose={() => setApiError(null)} />}

      {currentStep === 0 && (
        <Step1BookingType
          form={form}
          errors={errors}
          totalSeats={derived.totalSeats}
          totalPrice={derived.totalPrice}
          impactMessage={derived.impactMessage}
          onSelectType={handleSelectType}
          onFieldChange={handleFieldChange}
        />
      )}

      {currentStep === 1 && (
        <Step2Details
          form={form}
          errors={errors}
          displayName={derived.displayName}
          onGuestInfoChange={(field, value) => handleFieldChange(field, value)}
          onFieldChange={handleFieldChange}
        />
      )}

      {currentStep === 2 && <Step3Review form={form} derived={derived} />}

      {currentStep === 3 && <Step4Payment derived={derived} />}

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={goToPreviousStep} disabled={currentStep === 0}>
          Back
        </Button>
        <Button type="submit" size="lg" className="sm:min-w-[240px]" loading={isSubmitting}>
          {nextButtonLabel}
        </Button>
      </div>
    </form>
  );
}
