"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { validateBookingReference } from "@/lib/utils/validation";
import { getBookingByReference } from "@/lib/api/bookings";
import { BOOKING_REFERENCE } from "@/lib/utils/constants";

export default function ReturnPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const validation = validateBookingReference(reference);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setIsLoading(true);

    try {
      // Verify booking exists
      const trimmedRef = reference.trim().toUpperCase();
      const booking = await getBookingByReference(trimmedRef);

      // Navigate directly to the final destination to avoid an intermediate blank redirect page.
      if (booking.status === "confirmed") {
        router.push(`/booking/${trimmedRef}/confirmation`);
      } else {
        router.push(`/booking/${trimmedRef}/payment`);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        setError("Booking not found. Please check your reference and try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Check Your Booking
            </h1>
            <p className="text-lg text-gray-600">
              View or confirm your booking details
            </p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert
                type="info"
                message={`Enter your booking reference to retrieve your booking. Example: ${BOOKING_REFERENCE.EXAMPLE}`}
              />

              <Input
                label="Booking Reference"
                name="reference"
                type="text"
                value={reference}
                onChange={(value) => {
                  setReference(value.toUpperCase());
                  setError(null);
                }}
                error={error || undefined}
                required
                placeholder={BOOKING_REFERENCE.EXAMPLE}
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Continue"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have a booking yet?{" "}
                <a href="/" className="text-primary hover:text-primary-dark font-medium">
                  Book now
                </a>
              </p>
            </div>
          </Card>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
