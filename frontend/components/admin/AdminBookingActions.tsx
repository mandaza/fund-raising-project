"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
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
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        No pending proof is available to review right now.
      </div>
    );
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
        <Button
          onClick={onApprove}
          loading={actionLoading === "approve"}
          disabled={actionLoading !== null}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve payment
        </Button>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">Reject reason</label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Explain why this proof is rejected..."
          />
          <div className="mt-3">
            <Button
              variant="outline"
              onClick={onReject}
              loading={actionLoading === "reject"}
              disabled={actionLoading !== null}
              className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Reject payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
