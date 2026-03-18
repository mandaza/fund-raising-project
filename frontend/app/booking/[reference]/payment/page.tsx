import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { BookingReference } from "@/components/display/BookingReference";
import { PaymentMethodCard } from "@/components/display/PaymentMethodCard";
import { getBookingByReference } from "@/lib/api/bookings";
import { PAYMENT_METHODS, PRICING } from "@/lib/utils/constants";

interface PaymentPageProps {
  params: Promise<{ reference: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { reference } = await params;

  let booking;
  try {
    booking = await getBookingByReference(reference);
  } catch (error) {
    notFound();
  }

  if (!booking) {
    notFound();
  }

  // Calculate total amount
  const totalAmount = booking.seats === 1
    ? PRICING.INDIVIDUAL_SEAT
    : (booking.seats / PRICING.SEATS_PER_TABLE) * PRICING.CORPORATE_TABLE;
  const minimumDeposit = booking.seats === 1 ? PRICING.INDIVIDUAL_MIN_DEPOSIT : PRICING.CORPORATE_MIN_DEPOSIT;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Payment Instructions
            </h1>
            <p className="text-lg text-gray-600">
              Complete your booking by making payment and uploading proof
            </p>
          </div>

          <div className="space-y-6">
            {/* Booking Reference */}
            <BookingReference reference={reference} />

            {/* Booking Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize text-amber-600">{booking.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats Reserved:</span>
                  <span className="font-medium">{booking.seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum deposit:</span>
                  <span className="font-medium">
                    ${minimumDeposit} {PRICING.CURRENCY}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total Amount Due:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalAmount} {PRICING.CURRENCY}
                  </span>
                </div>
              </div>
            </Card>

            {/* Important Instructions */}
            <Alert
              type="info"
              title="Important Instructions"
              message="Please make payment using one of the methods below, then upload your payment proof on the next page. Your booking will be confirmed once we verify your payment."
            />

            {/* Payment Methods */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Your Payment Method
              </h3>
              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentMethodCard key={method.method} method={method} />
                ))}
              </div>
            </div>

            {/* CTA to Upload */}
            <Card className="bg-primary/10 border-primary/25">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Made Your Payment?
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your payment proof to complete your booking
                </p>
                <Link href={`/booking/${reference}/upload`}>
                  <Button size="lg" variant="primary">
                    Upload Payment Proof
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
