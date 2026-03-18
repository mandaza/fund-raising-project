"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { CorporateBookingForm } from "@/components/forms/CorporateBookingForm";
import { PRICING } from "@/lib/utils/constants";

export default function CorporateBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book a Corporate Table
            </h1>
            <p className="text-lg text-gray-600">
              Make a bigger impact while connecting with your team and community
            </p>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Corporate tables are built for impact</h2>
              <p className="text-gray-700">
                Corporate tables are ideal for organisations, teams, and partners who want to support a meaningful
                cause while enjoying a premium event experience.
              </p>
            </Card>

            <Card padding="lg" className="bg-primary/10 border-primary/25">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Impact</h2>
              <p className="text-gray-700">
                A corporate table booking helps fund essential programs for children with neurological disabilities,
                including therapy, caregiver support, and community outreach.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Table Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-900">Seats per table</p>
                  <p className="text-2xl font-bold text-primary mt-1">{PRICING.SEATS_PER_TABLE}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-900">Price per table</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ${PRICING.CORPORATE_TABLE} <span className="text-base font-medium text-gray-600">{PRICING.CURRENCY}</span>
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-900">What’s included</p>
                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    <li>Reserved seating</li>
                    <li>Group experience</li>
                    <li>Community recognition</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <p className="text-sm text-gray-600 mb-6">
                Please provide your organisation details and contact information to secure your corporate table.
              </p>
              <CorporateBookingForm />
            </Card>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
