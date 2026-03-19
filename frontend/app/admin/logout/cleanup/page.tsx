import { AdminLogoutCleanup } from "@/components/admin/AdminLogoutCleanup";

interface AdminLogoutCleanupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLogoutCleanupPage({ searchParams }: AdminLogoutCleanupPageProps) {
  const { next } = await searchParams;

  return <AdminLogoutCleanup nextPath={next || "/admin/login"} />;
}
