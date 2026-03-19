import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4 py-16">
      <Container size="sm">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            This admin page is unavailable or your session is no longer authorized to view it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Go To Admin Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
