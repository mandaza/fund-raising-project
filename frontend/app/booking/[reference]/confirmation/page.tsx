import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { BookingReference } from "@/components/display/BookingReference";
import { getBookingByReference } from "@/lib/api/bookings";
import { EVENT_INFO, CONTACT_INFO, PRICING } from "@/lib/utils/constants";

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
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

  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="space-y-6">
            {/* Success Alert */}
            <Alert
              type={isConfirmed ? "success" : "warning"}
              title={
                isConfirmed
                  ? "Booking Confirmed!"
                  : "Payment Under Review"
              }
              message={
                isConfirmed
                  ? "Your booking has been confirmed. We look forward to seeing you at the event!"
                  : "We have received your payment proof and it is currently under review. You will be notified once your payment is confirmed."
              }
            />

            {/* Booking Reference */}
            <BookingReference reference={reference} />

            {/* Booking Details */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium capitalize ${
                      isConfirmed ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats Reserved:</span>
                  <span className="font-medium">{booking.seats}</span>
                </div>
                {booking.guest && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{booking.guest.full_name}</span>
                    </div>
                    {booking.guest.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{booking.guest.email}</span>
                      </div>
                    )}
                    {booking.guest.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{booking.guest.phone}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Event Details */}
            <Card className="bg-primary/10 border-primary/25">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{new Date(EVENT_INFO.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-medium">{EVENT_INFO.time}</p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{EVENT_INFO.venue}</p>
                    <p className="text-sm text-gray-600">{EVENT_INFO.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* What Happens Next */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <ol className="space-y-3">
                {!isConfirmed && (
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 text-primary font-medium text-sm mr-3 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Payment Verification</p>
                      <p className="text-sm text-gray-600">
                        Our team will review your payment proof within 24 hours
                      </p>
                    </div>
                  </li>
                )}
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 text-primary font-medium text-sm mr-3 flex-shrink-0">
                    {isConfirmed ? "1" : "2"}
                  </span>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-gray-600">
                      {isConfirmed
                        ? "Check your email for your booking confirmation"
                        : "Once approved, you'll receive a confirmation email with all details"}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 text-primary font-medium text-sm mr-3 flex-shrink-0">
                    {isConfirmed ? "2" : "3"}
                  </span>
                  <div>
                    <p className="font-medium">Event Day</p>
                    <p className="text-sm text-gray-600">
                      Present your booking reference at the entrance
                    </p>
                  </div>
                </li>
              </ol>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-3">
                If you have any questions or concerns, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Email:</span> {CONTACT_INFO.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {CONTACT_INFO.phone}
                </p>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg">
                  Return to Home
                </Button>
              </Link>
              {!isConfirmed && (
                <Link href={`/booking/${reference}/upload`}>
                  <Button variant="primary" size="lg">
                    Upload Different Proof
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
