"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { FileUpload } from "../ui/FileUpload";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { uploadPaymentProof } from "@/lib/api/bookings";
import { PaymentMethod } from "@/lib/types/payment";
import { PRICING } from "@/lib/utils/constants";

export interface PaymentProofUploadFormProps {
  bookingReference: string;
  suggestedAmount?: number;
  onSuccess: () => void;
}

export function PaymentProofUploadForm({
  bookingReference,
  suggestedAmount,
  onSuccess,
}: PaymentProofUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [method, setMethod] = useState<string>("");
  const [amount, setAmount] = useState(suggestedAmount?.toString() || "");
  const [currency] = useState(PRICING.CURRENCY);
  const [providerReference, setProviderReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!file) {
      newErrors.file = "Please select a file to upload";
    }

    if (!method) {
      newErrors.method = "Please select a payment method";
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("method", method);
      formData.append("amount", amount);
      formData.append("currency", currency);
      if (providerReference.trim()) {
        formData.append("provider_reference", providerReference.trim());
      }

      await uploadPaymentProof(bookingReference, formData);
      onSuccess();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to upload payment proof. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && <Alert type="error" message={apiError} dismissible onClose={() => setApiError(null)} />}

      <div className="space-y-4">
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <select
            id="method"
            name="method"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              if (errors.method) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.method;
                  return newErrors;
                });
              }
            }}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.method
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          >
            <option value="">Select payment method</option>
            <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
            <option value={PaymentMethod.ECOCASH}>EcoCash</option>
            <option value={PaymentMethod.CASH}>Cash</option>
            <option value={PaymentMethod.VISA}>Card Payment</option>
            <option value={PaymentMethod.OTHER}>Other</option>
          </select>
          {errors.method && <p className="text-sm text-red-600 mt-1">{errors.method}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount Paid"
            name="amount"
            type="number"
            value={amount}
            onChange={(value) => {
              setAmount(value);
              if (errors.amount) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.amount;
                  return newErrors;
                });
              }
            }}
            error={errors.amount}
            required
            min={0}
            placeholder="0.00"
            disabled={isSubmitting}
          />

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <input
              id="currency"
              name="currency"
              type="text"
              value={currency}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <Input
          label="Provider Reference"
          name="providerReference"
          type="text"
          value={providerReference}
          onChange={setProviderReference}
          placeholder="Transaction ID, Receipt Number, etc."
          helpText="Optional - For bank transfers or mobile money transactions"
          disabled={isSubmitting}
        />

        <FileUpload
          label="Upload Payment Proof"
          value={file}
          onChange={(newFile) => {
            setFile(newFile);
            if (errors.file) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.file;
                return newErrors;
              });
            }
          }}
          error={errors.file}
          disabled={isSubmitting}
        />
      </div>

      <Alert
        type="info"
        title="Important"
        message="Please ensure your payment proof is clear and includes the transaction details, date, and amount. Our team will review and confirm your payment within 24 hours."
      />

      <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Submit Payment Proof"}
      </Button>
    </form>
  );
}
