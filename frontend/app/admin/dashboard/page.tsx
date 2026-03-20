import Link from "next/link";
import { ArrowUpRight, CircleDollarSign, Clock3, RefreshCcw, Ticket, Users } from "lucide-react";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/badge";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminOverviewServer } from "@/lib/api/admin-server";

function formatMoney(currency: string, amount: number) {
  const rounded = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${rounded.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboardPage() {
  const { overview, error } = await getAdminOverviewServer(20);
  const bookings = overview?.bookings || [];
  const pendingShare =
    overview && overview.seatsBooked > 0
      ? Math.round((overview.pendingBookings / Math.max(overview.pendingBookings + overview.confirmedBookings, 1)) * 100)
      : 0;

  return (
    <AdminShell
      title="Dashboard"
      description="Monitor fundraising momentum, stay on top of pending proofs, and jump straight into booking reviews."
      currentSection="dashboard"
      actions={
        <>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </Link>
          <AdminLogoutButton />
        </>
      }
    >
      {error && <Alert type="error" message={error} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          title="Seats booked"
          value={overview ? overview.seatsBooked.toLocaleString() : "—"}
          description="Total reserved seats across all booking types."
          icon={<Users className="h-5 w-5" />}
          accent="green"
        />
        <AdminMetricCard
          title="Raised so far"
          value={overview ? formatMoney(overview.currency, overview.amountRaised) : "—"}
          description="Verified payment value tracked by the platform."
          icon={<CircleDollarSign className="h-5 w-5" />}
          accent="blue"
        />
        <AdminMetricCard
          title="Pending bookings"
          value={overview ? overview.pendingBookings.toLocaleString() : "—"}
          description="Reservations still awaiting payment approval."
          icon={<Clock3 className="h-5 w-5" />}
          accent="amber"
        />
        <AdminMetricCard
          title="Confirmed bookings"
          value={overview ? overview.confirmedBookings.toLocaleString() : "—"}
          description="Bookings fully approved and ready for the event."
          icon={<Ticket className="h-5 w-5" />}
          accent="slate"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 bg-slate-950 text-white shadow-sm hover:shadow-sm" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Review queue health</p>
              <h2 className="mt-2 text-2xl font-semibold">Keep payment verification moving</h2>
            </div>
            <Badge className="bg-white/10 text-white" variant="outline">
              {pendingShare}% pending
            </Badge>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-300">
            Use the recent bookings table below to open proof submissions quickly. The fastest way to reduce drop-off is
            to review pending proofs and confirm payments as they arrive.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending</p>
              <p className="mt-2 text-2xl font-semibold">{overview?.pendingBookings ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Confirmed</p>
              <p className="mt-2 text-2xl font-semibold">{overview?.confirmedBookings ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest batch</p>
              <p className="mt-2 text-2xl font-semibold">{bookings.length}</p>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Admin actions</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Operational shortcuts</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/admin/dashboard#bookings" className="block rounded-2xl border border-slate-200 p-4 transition hover:border-primary/30 hover:bg-primary/5">
              <p className="font-medium text-slate-900">Review latest bookings</p>
              <p className="mt-1 text-sm text-slate-500">Filter by pending or confirmed status and open proof review.</p>
            </Link>
            <Link href="/return" className="block rounded-2xl border border-slate-200 p-4 transition hover:border-primary/30 hover:bg-primary/5">
              <p className="font-medium text-slate-900">Open public booking lookup</p>
              <p className="mt-1 text-sm text-slate-500">Cross-check a booking reference using the public flow.</p>
            </Link>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Current focus</p>
              <p className="mt-1 text-sm text-slate-500">
                {overview && overview.pendingBookings > 0
                  ? `There are ${overview.pendingBookings} pending booking(s) waiting for review.`
                  : "No pending bookings right now. Great job staying current."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div id="bookings">
        <AdminBookingsTable bookings={bookings} />
      </div>
    </AdminShell>
  );
}

