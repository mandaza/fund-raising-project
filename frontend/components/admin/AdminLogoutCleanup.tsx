"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/api/admin";

interface AdminLogoutCleanupProps {
  nextPath: string;
}

export function AdminLogoutCleanup({ nextPath }: AdminLogoutCleanupProps) {
  const router = useRouter();

  useEffect(() => {
    clearAdminToken();
    router.replace(nextPath);
  }, [nextPath, router]);

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
      <p className="text-sm text-gray-600">Signing you out...</p>
    </div>
  );
}
