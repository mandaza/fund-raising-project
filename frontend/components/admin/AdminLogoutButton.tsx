"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface AdminLogoutButtonProps {
  redirectTo?: string;
}

export function AdminLogoutButton({ redirectTo = "/admin/login" }: AdminLogoutButtonProps) {
  const router = useRouter();

  const onLogout = () => {
    router.push(`/admin/logout?next=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
}
