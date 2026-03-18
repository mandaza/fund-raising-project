import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { BOOKING_REFERENCE } from "@/lib/utils/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Container size="sm">
        <Card padding="lg">
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Not Found
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              The booking reference you entered could not be found in our system.
            </p>

            <div className="bg-primary/10 border border-primary/25 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-dark">
                <span className="font-medium">Tip:</span> Booking references are in the format:{" "}
                <span className="font-mono font-bold">{BOOKING_REFERENCE.EXAMPLE}</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please check your booking reference and try again, or contact us for assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/return">
                  <Button size="lg">
                    Try Different Reference
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
