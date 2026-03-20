import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="min-h-screen bg-[#f5f7f6] text-slate-900">{children}</div>;
}
