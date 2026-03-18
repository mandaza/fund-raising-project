import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <Container size="md">
          <div className="space-y-6 animate-pulse">
            {/* Alert Skeleton */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="h-5 bg-green-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-green-200 rounded w-3/4"></div>
            </div>

            {/* Booking Reference Skeleton */}
            <div className="bg-primary/10 border-2 border-primary/25 rounded-lg p-6">
              <div className="h-4 bg-primary/25 rounded w-1/4 mx-auto mb-2"></div>
              <div className="h-8 bg-primary/25 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Cards Skeleton */}
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
