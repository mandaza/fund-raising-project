"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { BookingReference } from "@/components/display/BookingReference";
import { PaymentProofUploadForm } from "@/components/forms/PaymentProofUploadForm";

interface UploadPageProps {
  params: Promise<{ reference: string }>;
}

export default function UploadPage({ params }: UploadPageProps) {
  const { reference } = use(params);
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirect to confirmation page after a short delay
    setTimeout(() => {
      router.push(`/booking/${reference}/confirmation`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Upload Payment Proof
            </h1>
            <p className="text-lg text-gray-600">
              Submit your payment receipt for verification
            </p>
          </div>

          <div className="space-y-6">
            {/* Booking Reference */}
            <BookingReference reference={reference} />

            {showSuccess ? (
              <Alert
                type="success"
                title="Payment Proof Uploaded Successfully!"
                message="Thank you! We have received your payment proof. Our team will review and confirm your booking within 24 hours. Redirecting to confirmation page..."
              />
            ) : (
              <Card padding="lg">
                <PaymentProofUploadForm
                  bookingReference={reference}
                  onSuccess={handleSuccess}
                />
              </Card>
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
