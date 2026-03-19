import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { adminLoginAction } from "./actions";

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-neutral-light flex items-center py-12">
      <Container size="sm">
        <Card padding="lg">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo/mosh-logo.png"
              alt="MOSH"
              width={180}
              height={60}
              priority
              className="h-14 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">Sign in to manage bookings and verify payments.</p>

          {error && <Alert type="error" message={error} />}

          <form action={adminLoginAction} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}

