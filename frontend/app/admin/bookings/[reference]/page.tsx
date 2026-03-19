import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminBookingActions } from "@/components/admin/AdminBookingActions";
import { getAdminBookingServer } from "@/lib/api/admin-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function ProofPreview({ filePath, contentType }: { filePath: string; contentType: string | null }) {
  const url = `${API_URL}/uploads/${filePath}`;
  const isPdf = (contentType || "").includes("pdf") || filePath.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
        <iframe title="Payment proof PDF" src={url} className="w-full h-[520px]" />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
      <img src={url} alt="Payment proof" className="w-full h-auto block" />
    </div>
  );
}

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
    <div className="min-h-screen bg-neutral-light py-10">
      <Container size="xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="text-sm font-medium text-primary hover:text-primary-dark">
                ← Back to dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Booking {reference}</h1>
            <p className="text-gray-600 mt-1">Review details and verify proof of payment.</p>
          </div>
          <AdminLogoutButton />
        </div>

        {error && <Alert type="error" message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking details</h2>
              {booking ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Guest</p>
                    <p className="font-medium text-gray-900">{booking.guest?.full_name}</p>
                    {booking.guest?.email && <p className="text-gray-700">{booking.guest.email}</p>}
                    {booking.guest?.phone && <p className="text-gray-700">{booking.guest.phone}</p>}
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium text-gray-900 capitalize">{booking.guest?.guest_type}</p>
                    <p className="text-gray-600 mt-3">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{booking.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seats</p>
                    <p className="font-medium text-gray-900 tabular-nums">{booking.seats}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">{new Date(booking.created_at).toLocaleString()}</p>
                  </div>
                  {booking.notes && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-600">Notes</p>
                      <p className="text-gray-900">{booking.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Booking details are unavailable.</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payments & proofs</h2>
              {!booking?.payments?.length ? (
                <p className="text-gray-600">No payments submitted yet.</p>
              ) : (
                <div className="space-y-5">
                  {booking.payments.map((payment) => (
                    <div key={payment.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.method} • {payment.currency} {payment.amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment ID: <span className="font-mono">{payment.id}</span>
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Submitted:{" "}
                          {payment.paid_at
                            ? new Date(payment.paid_at).toLocaleString()
                            : new Date(payment.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-4 space-y-3">
                        {(payment.proofs || []).map((proof) => (
                          <div key={proof.id} className="rounded-lg bg-white border border-gray-200 p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Proof: {proof.original_filename || proof.file_path}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Status: <span className="capitalize">{proof.verification_status}</span>
                                  {proof.rejection_reason ? ` • Reason: ${proof.rejection_reason}` : ""}
                                </p>
                              </div>
                              <a
                                className="text-sm font-medium text-primary hover:text-primary-dark"
                                href={`${API_URL}/uploads/${proof.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open
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
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Proof preview</h2>
              {latestPendingProof ? (
                <div className="space-y-4">
                  <ProofPreview filePath={latestPendingProof.proof.file_path} contentType={latestPendingProof.proof.content_type} />
                  <AdminBookingActions paymentId={latestPendingProof.paymentId} />
                </div>
              ) : (
                <AdminBookingActions paymentId={null} />
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

