import Link from "next/link";
import { ArrowLeft, CircleDollarSign, Clock3, FileCheck2, Mail, Phone, UserRound } from "lucide-react";
import { AdminProofPreview } from "@/components/admin/AdminProofPreview";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/badge";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminBookingActions } from "@/components/admin/AdminBookingActions";
import { getAdminBookingServer } from "@/lib/api/admin-server";

interface AdminBookingDetailPageProps {
  params: Promise<{ reference: string }>;
}

export default async function AdminBookingDetailPage({ params }: AdminBookingDetailPageProps) {
  const { reference } = await params;
  const { booking, error } = await getAdminBookingServer(reference);

  const latestPendingProof = (() => {
    const payments = booking?.payments || [];
    for (const payment of payments) {
      const proof = (payment.proofs || [])
        .filter((item) => item.verification_status === "pending")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (proof) {
        return { paymentId: payment.id, proof };
      }
    }
    return null;
  })();

  return (
    <AdminShell
      title={`Booking ${reference}`}
      description="Review the guest details, inspect proof uploads, and approve or reject payment with confidence."
      currentSection="bookings"
      actions={
        <>
          <Link href="/admin/dashboard">
            <Badge variant="outline" className="gap-2 px-3 py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Badge>
          </Link>
          <AdminLogoutButton />
        </>
      }
    >
      {error && <Alert type="error" message={error} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Guest</p>
              <p className="font-semibold text-slate-900">{booking?.guest?.full_name || "Unknown guest"}</p>
            </div>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <div className="mt-1">
                <AdminStatusBadge status={booking?.status} />
              </div>
            </div>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Seats reserved</p>
              <p className="font-semibold tabular-nums text-slate-900">{booking?.seats ?? "—"}</p>
            </div>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="font-semibold text-slate-900">
                {booking ? new Date(booking.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Guest profile</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{booking?.guest?.full_name || "Unknown guest"}</h2>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {booking?.guest?.email || "Email not provided"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {booking?.guest?.phone || "Phone not provided"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Booking type</p>
                  <p className="mt-2 text-base font-semibold capitalize text-slate-900">
                    {booking?.guest?.guest_type?.replaceAll("_", " ") || "Unknown"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reference</p>
                  <p className="mt-2 font-mono text-sm font-semibold text-slate-900">{booking?.reference || reference}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Booking notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {booking?.notes || "No additional notes were submitted for this booking."}
              </p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
            <h2 className="text-xl font-semibold text-slate-950">Payments and proof history</h2>
            {!booking?.payments?.length ? (
              <p className="mt-4 text-sm text-slate-500">No payments submitted yet.</p>
            ) : (
              <div className="mt-6 space-y-5">
                {booking.payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {payment.method.replaceAll("_", " ")} • {payment.currency} {payment.amount}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Payment ID: <span className="font-mono">{payment.id}</span>
                        </p>
                      </div>
                      <p className="text-sm text-slate-500">
                        Submitted{" "}
                        {payment.paid_at
                          ? new Date(payment.paid_at).toLocaleString()
                          : new Date(payment.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {(payment.proofs || []).map((proof) => (
                        <div key={proof.id} className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {proof.original_filename || proof.file_path}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <AdminStatusBadge status={proof.verification_status} />
                                {proof.rejection_reason && (
                                  <Badge variant="destructive">Reason: {proof.rejection_reason}</Badge>
                                )}
                              </div>
                            </div>
                            <a
                              className="text-sm font-medium text-primary hover:text-primary-dark"
                              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/uploads/${proof.file_path}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open proof
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
            <h2 className="text-xl font-semibold text-slate-950">Proof preview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Inspect the latest pending proof before approving or rejecting payment.
            </p>

            <div className="mt-6 space-y-4">
              {latestPendingProof ? (
                <>
                  <AdminProofPreview
                    filePath={latestPendingProof.proof.file_path}
                    contentType={latestPendingProof.proof.content_type}
                  />
                  <AdminBookingActions paymentId={latestPendingProof.paymentId} />
                </>
              ) : (
                <AdminBookingActions paymentId={null} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

