import {
  BookingResponse,
  CorporateBookingRequest,
  IndividualBookingRequest,
} from "../types/booking";
import { apiRequest, getApiUrl } from "./client";

export interface BookingImpactSummary {
  bookings_count: number;
  seats_booked: number;
  amount_raised: string;
  currency: string;
}

export async function createCorporateBooking(
  data: CorporateBookingRequest
): Promise<BookingResponse> {
  return apiRequest<BookingResponse>("/api/bookings/corporate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function createIndividualBooking(
  data: IndividualBookingRequest
): Promise<BookingResponse> {
  return apiRequest<BookingResponse>("/api/bookings/individual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getBookingByReference(
  reference: string
): Promise<BookingResponse> {
  return apiRequest<BookingResponse>(`/api/bookings/${reference}`);
}

export async function getBookingImpactSummary(): Promise<BookingImpactSummary> {
  return apiRequest<BookingImpactSummary>("/api/bookings/summary");
}

export async function uploadPaymentProof(
  reference: string,
  formData: FormData
): Promise<any> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/api/bookings/${reference}/payment-proofs`, {
    method: "POST",
    body: formData,
    // Don't set Content-Type - browser sets it with boundary for multipart
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // If response is not JSON, use statusText
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
