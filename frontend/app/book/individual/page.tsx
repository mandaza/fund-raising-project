"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { IndividualBookingForm } from "@/components/forms/IndividualBookingForm";

export default function IndividualBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book Individual Seat
            </h1>
            <p className="text-lg text-gray-600">
              Join us and make a difference, one seat at a time
            </p>
          </div>

          <div className="space-y-6">
            <Card padding="lg" className="bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Every seat supports a child</h2>
              <p className="text-gray-700">
                Every individual seat booked contributes directly to supporting children with special needs and
                empowering their families.
              </p>
            </Card>

            <Card padding="lg" className="bg-primary/10 border-primary/25">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Impact</h2>
              <p className="text-gray-700">
                Your seat helps fund therapy sessions, awareness programs, and inclusive initiatives.
              </p>
            </Card>

            <Card padding="lg">
              <p className="text-sm text-gray-600 mb-6">
                Please enter your details to reserve your seat for the fundraising event.
              </p>
              <IndividualBookingForm />
            </Card>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
