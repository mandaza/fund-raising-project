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
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="space-y-6">
            {/* Booking Reference Skeleton */}
            <div className="bg-primary/10 border-2 border-primary/25 rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-primary/25 rounded w-1/4 mx-auto mb-2"></div>
                <div className="h-8 bg-primary/25 rounded w-1/2 mx-auto"></div>
              </div>
            </div>

            {/* Booking Summary Skeleton */}
            <Card>
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </Card>

            {/* Payment Methods Skeleton */}
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
