"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { adminApprovePayment, adminRejectPayment, clearAdminToken } from "@/lib/api/admin";
import { APIError } from "@/lib/api/client";

interface AdminBookingActionsProps {
  paymentId: string | null;
}

export function AdminBookingActions({ paymentId }: AdminBookingActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!paymentId) {
    return <p className="text-gray-600">No pending proof available to preview.</p>;
  }

  const handleAuthError = (error: unknown) => {
    if (error instanceof APIError && (error.status === 401 || error.status === 403)) {
      clearAdminToken();
      router.replace("/admin/login");
      return true;
    }

    return false;
  };

  const onApprove = async () => {
    setActionLoading("approve");
    setError(null);

    try {
      await adminApprovePayment(paymentId);
      router.refresh();
    } catch (error) {
      if (handleAuthError(error)) return;
      setError(error instanceof Error ? error.message : "Approve failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const onReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      setError("Please provide a rejection reason.");
      return;
    }

    setActionLoading("reject");
    setError(null);

    try {
      await adminRejectPayment(paymentId, reason);
      setRejectReason("");
      router.refresh();
    } catch (error) {
      if (handleAuthError(error)) return;
      setError(error instanceof Error ? error.message : "Reject failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} dismissible onClose={() => setError(null)} />}

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
            placeholder="Explain why this proof is rejected..."
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
  );
}
