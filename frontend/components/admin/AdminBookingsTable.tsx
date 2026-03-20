"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminOverviewBooking } from "@/lib/types/admin";

interface AdminBookingsTableProps {
  bookings: AdminOverviewBooking[];
}

function formatGuestType(value: string | null | undefined) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}

export function AdminBookingsTable({ bookings }: AdminBookingsTableProps) {
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredBySearch = useMemo(() => {
    return bookings.filter((booking) => {
      if (!normalizedSearch) return true;

      return [booking.reference, booking.guest?.full_name, booking.guest?.guest_type, booking.status]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch));
    });
  }, [bookings, normalizedSearch]);

  const getFilteredBookings = (status: string) =>
    filteredBySearch.filter((booking) => status === "all" || booking.status === status);

  const renderTable = (status: string) => {
    const rows = getFilteredBookings(status);

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              {rows.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-mono text-xs font-semibold tracking-wide text-slate-900">
                    {booking.reference}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{booking.guest?.full_name || "Unknown guest"}</div>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-600">{formatGuestType(booking.guest?.guest_type)}</td>
                  <td className="px-4 py-4 font-medium tabular-nums text-slate-900">{booking.seats}</td>
                  <td className="px-4 py-4">
                    <AdminStatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">{new Date(booking.created_at).toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/admin/bookings/${booking.reference}`}>
                      <Button size="sm" variant="outline" className="gap-2">
                        View
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No bookings match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Recent bookings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, and open a booking to review proof of payment.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by reference, guest, type, or status"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <Badge variant="outline">{filteredBySearch.length} visible booking(s)</Badge>
        </div>

        <TabsContent value="all" className="mt-4">
          {renderTable("all")}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {renderTable("pending")}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-4">
          {renderTable("confirmed")}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          {renderTable("cancelled")}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
