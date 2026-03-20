import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BookingLookupErrorState } from "@/components/display/BookingLookupErrorState";
import { getBookingByReference } from "@/lib/api/bookings";
import { APIError } from "@/lib/api/client";

interface BookingPageProps {
  params: Promise<{ reference: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { reference } = await params;

  try {
    const booking = await getBookingByReference(reference);

    if (!booking) {
      notFound();
    }

    // Check booking status and redirect accordingly
    if (booking.status === "confirmed") {
      // Already confirmed - go to confirmation page
      redirect(`/booking/${reference}/confirmation`);
    } else {
      // Pending - go to payment instructions
      redirect(`/booking/${reference}/payment`);
    }
  } catch (error) {
    // Only show "not found" for actual 404 errors
    if (error instanceof APIError && error.status === 404) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <section className="py-12">
          <Container size="md">
            <BookingLookupErrorState reference={reference} retryHref={`/booking/${reference}`} />
          </Container>
        </section>
        <Footer />
      </div>
    );
  }
}
