import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BookingReference } from "@/components/display/BookingReference";

interface BookingLookupErrorStateProps {
  reference: string;
  retryHref: string;
  title?: string;
  message?: string;
}

export function BookingLookupErrorState({
  reference,
  retryHref,
  title = "We could not load your booking right now",
  message = "The booking service is temporarily unavailable. Please try again in a moment. If the problem continues, use your booking reference when contacting support.",
}: BookingLookupErrorStateProps) {
  return (
    <div className="space-y-6">
      <Alert type="warning" title={title} message={message} />

      <BookingReference reference={reference} />

      <Card>
        <h3 className="text-lg font-semibold text-gray-900">What you can do</h3>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>Retry this page in a few seconds.</li>
          <li>Keep your booking reference safe for payment or support follow-up.</li>
          <li>If you just created this booking, your reservation may still have been saved successfully.</li>
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={retryHref}>
            <Button size="lg">Try Again</Button>
          </Link>
          <Link href="/return">
            <Button size="lg" variant="outline">
              Check Another Booking
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
