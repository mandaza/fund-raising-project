"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getApiUrl } from "@/lib/api/client";
import {
  adminApprovePayment,
  adminGetBooking,
  adminRejectPayment,
  clearAdminToken,
  getAdminToken,
} from "@/lib/api/admin";

function ProofPreview({ filePath, contentType }: { filePath: string; contentType: string | null }) {
  const url = `${getApiUrl()}/uploads/${filePath}`;
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

export default function AdminBookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ reference: string }>();
  const reference = params.reference;

  const token = useMemo(() => getAdminToken(), []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetBooking(reference);
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, router, token]);

  const logout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  const latestPendingProof = (() => {
    const payments = booking?.payments || [];
    for (const p of payments) {
      const proofs = p.proofs || [];
      const pending = proofs
        .filter((x: any) => x.verification_status === "pending")
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      if (pending) return { payment: p, proof: pending };
    }
    return null;
  })();

  const onApprove = async () => {
    if (!latestPendingProof) return;
    setActionLoading("approve");
    setError(null);
    try {
      await adminApprovePayment(latestPendingProof.payment.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const onReject = async () => {
    if (!latestPendingProof) return;
    const reason = rejectReason.trim();
    if (!reason) {
      setError("Please provide a rejection reason.");
      return;
    }
    setActionLoading("reject");
    setError(null);
    try {
      await adminRejectPayment(latestPendingProof.payment.id, reason);
      setRejectReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed.");
    } finally {
      setActionLoading(null);
    }
  };

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
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {error && <Alert type="error" message={error} dismissible onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking details</h2>
              {loading ? (
                <p className="text-gray-600">Loading…</p>
              ) : booking ? (
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
                <p className="text-gray-600">Not found.</p>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payments & proofs</h2>
              {!booking?.payments?.length ? (
                <p className="text-gray-600">No payments submitted yet.</p>
              ) : (
                <div className="space-y-5">
                  {booking.payments.map((p: any) => (
                    <div key={p.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {p.method} • {p.currency} {p.amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment ID: <span className="font-mono">{p.id}</span>
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Submitted: {p.paid_at ? new Date(p.paid_at).toLocaleString() : new Date(p.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-4 space-y-3">
                        {(p.proofs || []).map((proof: any) => (
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
                                href={`${getApiUrl()}/uploads/${proof.file_path}`}
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

                  <div className="grid grid-cols-1 gap-3">
                    <Button onClick={onApprove} loading={actionLoading === "approve"} disabled={actionLoading !== null}>
                      Approve payment
                    </Button>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Reject reason</label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Explain why this proof is rejected…"
                      />
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          onClick={onReject}
                          loading={actionLoading === "reject"}
                          disabled={actionLoading !== null}
                          className="w-full"
                        >
                          Reject payment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No pending proof available to preview.</p>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

