import { Badge } from "@/components/ui/badge";

interface AdminStatusBadgeProps {
  status: string | null | undefined;
}

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const normalized = (status || "unknown").toLowerCase();

  const variant =
    normalized === "confirmed" || normalized === "verified"
      ? "success"
      : normalized === "pending"
        ? "warning"
        : normalized === "rejected" || normalized === "cancelled"
          ? "destructive"
          : "secondary";

  return <Badge variant={variant}>{normalized.replaceAll("_", " ")}</Badge>;
}
