import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/admin-session";
import { AdminBookingDetailViewModel, AdminOverviewViewModel } from "@/lib/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ADMIN_REQUEST_TIMEOUT_MS = 10000;

export async function getAdminAccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return token;
}

export async function getAdminOverviewServer(limit: number = 20): Promise<{
  overview: AdminOverviewViewModel | null;
  error: string | null;
}> {
  const token = await getAdminAccessToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ADMIN_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/admin/overview?limit=${limit}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      notFound();
    }

    if (!response.ok) {
      let detail = "Failed to load dashboard.";

      try {
        const errorData = await response.json();
        detail = errorData.detail || detail;
      } catch {
        // Keep the fallback message if the error payload is not JSON.
      }

      return { overview: null, error: detail };
    }

    const data = await response.json();
    const amountRaised = Number(data.amount_raised);

    return {
      overview: {
        seatsBooked: Number(data.seats_booked) || 0,
        amountRaised: Number.isFinite(amountRaised) ? amountRaised : 0,
        currency: data.currency || "USD",
        pendingBookings: Number(data.pending_count) || 0,
        confirmedBookings: Number(data.confirmed_count) || 0,
        bookings: data.latest_bookings || [],
      },
      error: null,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { overview: null, error: "Dashboard request timed out. Please refresh and try again." };
    }

    return { overview: null, error: "Failed to load dashboard." };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getAdminBookingServer(reference: string): Promise<{
  booking: AdminBookingDetailViewModel | null;
  error: string | null;
}> {
  const token = await getAdminAccessToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ADMIN_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/admin/bookings/${reference}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      notFound();
    }

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      let detail = "Failed to load booking.";

      try {
        const errorData = await response.json();
        detail = errorData.detail || detail;
      } catch {
        // Keep the fallback message if the error payload is not JSON.
      }

      return { booking: null, error: detail };
    }

    return {
      booking: await response.json(),
      error: null,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { booking: null, error: "Booking request timed out. Please refresh and try again." };
    }

    return { booking: null, error: "Failed to load booking." };
  } finally {
    clearTimeout(timeout);
  }
}
