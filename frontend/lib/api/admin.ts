"use client";

import { apiRequest } from "./client";
import { ADMIN_TOKEN_COOKIE, ADMIN_TOKEN_STORAGE_KEY } from "@/lib/auth/admin-session";

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

export interface AdminGuestSummary {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  guest_type: "individual" | "corporate" | "sponsor" | "vip";
}

export interface AdminPaymentProofSummary {
  id: string;
  file_path: string;
  original_filename: string | null;
  content_type: string | null;
  verification_status: "pending" | "verified" | "rejected";
  verified_by_admin_id: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface AdminPaymentSummary {
  id: string;
  method: string;
  amount: string;
  currency: string;
  provider_reference: string | null;
  paid_at: string | null;
  created_at: string;
  proofs: AdminPaymentProofSummary[];
}

export interface AdminBookingListItem {
  id: string;
  reference: string;
  status: "pending" | "confirmed" | "cancelled";
  seats: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  guest: AdminGuestSummary;
}

export interface AdminBookingDetail extends AdminBookingListItem {
  payments: AdminPaymentSummary[];
}

function getCookieToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith(`${ADMIN_TOKEN_COOKIE}=`));
  if (!tokenCookie) return null;

  return decodeURIComponent(tokenCookie.split("=").slice(1).join("="));
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookieToken() || window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  document.cookie = `${ADMIN_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  document.cookie = `${ADMIN_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function withAuth(options: RequestInit = {}): RequestInit {
  const token = getAdminToken();
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function adminListBookings(params?: {
  status?: string;
  guest_type?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminBookingListItem[]> {
  const usp = new URLSearchParams();
  if (params?.status) usp.set("status", params.status);
  if (params?.guest_type) usp.set("guest_type", params.guest_type);
  usp.set("limit", String(params?.limit ?? 50));
  usp.set("offset", String(params?.offset ?? 0));
  const qs = usp.toString();
  return apiRequest<AdminBookingListItem[]>(`/api/admin/bookings${qs ? `?${qs}` : ""}`, withAuth());
}

export async function adminGetBooking(reference: string): Promise<AdminBookingDetail> {
  return apiRequest<AdminBookingDetail>(`/api/admin/bookings/${reference}`, withAuth());
}

export async function adminApprovePayment(paymentId: string): Promise<AdminPaymentProofSummary> {
  return apiRequest<AdminPaymentProofSummary>(`/api/admin/payments/${paymentId}/approve`, {
    ...withAuth(),
    method: "POST",
    headers: { "Content-Type": "application/json", ...(withAuth().headers || {}) },
    body: JSON.stringify({ admin_id: null }),
  });
}

export async function adminRejectPayment(paymentId: string, rejection_reason: string): Promise<AdminPaymentProofSummary> {
  return apiRequest<AdminPaymentProofSummary>(`/api/admin/payments/${paymentId}/reject`, {
    ...withAuth(),
    method: "POST",
    headers: { "Content-Type": "application/json", ...(withAuth().headers || {}) },
    body: JSON.stringify({ rejection_reason, admin_id: null }),
  });
}

export interface AdminDashboardOverview {
  pending_count: number;
  confirmed_count: number;
  seats_booked: number;
  amount_raised: string;
  currency: string;
  latest_bookings: AdminBookingListItem[];
}

export async function adminGetOverview(limit: number = 50): Promise<AdminDashboardOverview> {
  return apiRequest<AdminDashboardOverview>(`/api/admin/overview?limit=${limit}`, withAuth());
}

