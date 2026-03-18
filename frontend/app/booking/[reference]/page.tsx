import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
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
    // Re-throw other errors to show proper error page
    throw error;
  }
}
