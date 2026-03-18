"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { adminLogin, getAdminToken, setAdminToken } from "@/lib/api/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await adminLogin(username.trim(), password);
      setAdminToken(res.access_token);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

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

          {error && <Alert type="error" message={error} dismissible onClose={() => setError(null)} />}

          <form onSubmit={onSubmit} className="space-y-5">
            <Input label="Username" name="username" value={username} onChange={setUsername} required />
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}

