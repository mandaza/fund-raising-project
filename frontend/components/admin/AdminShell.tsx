import Image from "next/image";
import Link from "next/link";
import { BarChart3, CircleHelp, ExternalLink, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  title: string;
  description: string;
  currentSection: "dashboard" | "bookings";
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "bookings", label: "Review Queue", href: "/admin/dashboard#bookings", icon: ShieldCheck },
];

export function AdminShell({ title, description, currentSection, actions, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f7f6] py-8 text-slate-900">
      <Container size="xl">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="lg">
              <div className="flex items-center gap-3">
                <Image src="/logo/mosh-logo.png" alt="MOSH" width={96} height={32} className="h-8 w-auto" priority />
                <div>
                  <p className="text-sm font-semibold text-slate-900">MOSH Admin</p>
                  <p className="text-xs text-slate-500">Fundraising operations</p>
                </div>
              </div>

              <Separator className="my-6" />

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === currentSection;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="h-4 w-4 text-[#facc5c]" />
                    Operations snapshot
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    Track bookings, review proofs, and keep confirmation workflows moving smoothly.
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2 font-medium text-slate-800">
                    <CircleHelp className="h-4 w-4 text-primary" />
                    Quick links
                  </p>
                  <div className="mt-3 space-y-2">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-dark">
                      <ExternalLink className="h-4 w-4" />
                      Open public site
                    </Link>
                    <Link href="/return" className="flex items-center gap-2 text-primary hover:text-primary-dark">
                      <ExternalLink className="h-4 w-4" />
                      Check booking lookup
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          <main className="min-w-0 space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Admin workspace</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
                </div>
                {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
              </div>
            </div>

            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
