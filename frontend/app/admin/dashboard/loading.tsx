import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-light py-10">
      <Container size="xl">
        <div className="flex items-start justify-between gap-4 mb-6 animate-pulse">
          <div>
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="h-11 w-28 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-9 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="animate-pulse">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="h-7 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-7 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
