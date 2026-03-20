import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { BookingWizard } from "@/components/BookingWizard/BookingWizard";
import { PRICING } from "@/lib/utils/constants";

interface BookingPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { type } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Reserve your place</h1>
            <p className="mt-2 text-lg text-gray-600">
              A guided booking flow for individual seats and corporate tables.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Every booking supports a child with special needs</h2>
              <p className="mt-3 text-gray-700">
                Move through the steps at your own pace, review your impact, and continue to payment with confidence.
              </p>
            </Card>

            <Card className="bg-primary/10 border-primary/25">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/40 bg-white/70 p-4">
                  <p className="text-sm font-medium text-gray-900">Individual seat</p>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    ${PRICING.INDIVIDUAL_SEAT} <span className="text-base font-medium text-gray-600">{PRICING.CURRENCY}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-white/40 bg-white/70 p-4">
                  <p className="text-sm font-medium text-gray-900">Corporate table</p>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    ${PRICING.CORPORATE_TABLE} <span className="text-base font-medium text-gray-600">{PRICING.CURRENCY}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-white/40 bg-white/70 p-4">
                  <p className="text-sm font-medium text-gray-900">Seats per table</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{PRICING.SEATS_PER_TABLE}</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <BookingWizard initialType={type} />
            </Card>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
