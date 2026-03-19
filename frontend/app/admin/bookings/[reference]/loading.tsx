import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-light py-10">
      <Container size="xl">
        <div className="flex items-start justify-between gap-4 mb-6 animate-pulse">
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-10 bg-gray-200 rounded w-72 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="h-11 w-28 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="animate-pulse space-y-4">
                <div className="h-7 bg-gray-200 rounded w-48"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="animate-pulse space-y-5">
                <div className="h-7 bg-gray-200 rounded w-52"></div>
                {[1, 2].map((item) => (
                  <div key={item} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((proof) => (
                        <div key={proof} className="rounded-lg bg-white border border-gray-200 p-3">
                          <div className="flex justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="animate-pulse space-y-4">
                <div className="h-7 bg-gray-200 rounded w-40"></div>
                <div className="h-[520px] bg-gray-200 rounded-xl"></div>
                <div className="h-11 bg-gray-200 rounded-lg"></div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
