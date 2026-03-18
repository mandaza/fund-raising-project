"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { adminGetOverview, clearAdminToken, getAdminToken } from "@/lib/api/admin";

type Overview = {
  seatsBooked: number;
  amountRaised: number;
  currency: string;
  pendingBookings: number;
  confirmedBookings: number;
};

function formatMoney(currency: string, amount: number) {
  const rounded = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${rounded.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const token = useMemo(() => getAdminToken(), []);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetOverview(20);
        const amountRaised = Number(data.amount_raised);
        if (!cancelled) {
          setOverview({
            seatsBooked: data.seats_booked,
            amountRaised: Number.isFinite(amountRaised) ? amountRaised : 0,
            currency: data.currency || "USD",
            pendingBookings: data.pending_count,
            confirmedBookings: data.confirmed_count,
          });
          setBookings(data.latest_bookings || []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, token]);

  const onLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-light py-10">
      <Container size="xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview, bookings, and payment verification.</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {error && <Alert type="error" message={error} dismissible onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <p className="text-sm text-gray-600">People booked (seats)</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {overview ? overview.seatsBooked.toLocaleString() : loading ? "…" : "—"}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Raised so far</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {overview ? formatMoney(overview.currency, overview.amountRaised) : loading ? "…" : "—"}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Pending bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {overview ? overview.pendingBookings.toLocaleString() : loading ? "…" : "—"}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Confirmed bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
              {overview ? overview.confirmedBookings.toLocaleString() : loading ? "…" : "—"}
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
            <Link href="/admin/dashboard" className="text-sm font-medium text-primary hover:text-primary-dark">
              Refresh
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-900">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Guest</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Seats</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} className="border-t border-gray-100">
                    <td className="py-3 pr-4 font-mono text-gray-900">{b.reference}</td>
                    <td className="py-3 pr-4 text-gray-900">{b.guest?.full_name}</td>
                    <td className="py-3 pr-4 capitalize text-gray-900">{b.guest?.guest_type}</td>
                    <td className="py-3 pr-4 tabular-nums text-gray-900">{b.seats}</td>
                    <td className="py-3 pr-4 capitalize text-gray-900">{b.status}</td>
                    <td className="py-3 pr-4 text-gray-900">{new Date(b.created_at).toLocaleString()}</td>
                    <td className="py-3">
                      <Link href={`/admin/bookings/${b.reference}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {!loading && bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-600">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </div>
  );
}

