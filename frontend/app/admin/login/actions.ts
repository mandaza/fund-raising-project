"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function adminLoginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "Login failed.";

    try {
      const errorData = await response.json();
      detail = errorData.detail || detail;
    } catch {
      // Keep the fallback message when the backend response is not JSON.
    }

    redirect(`/admin/login?error=${encodeURIComponent(detail)}`);
  }

  const data = await response.json();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, data.access_token, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });

  redirect("/admin/dashboard");
}
