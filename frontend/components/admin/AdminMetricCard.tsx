import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface AdminMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accent?: "green" | "blue" | "amber" | "slate";
}

const accentClasses = {
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700",
};

export function AdminMetricCard({
  title,
  value,
  description,
  icon,
  accent = "green",
}: AdminMetricCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-sm" padding="md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className={cn("rounded-xl p-3", accentClasses[accent])}>{icon}</div>
      </div>
    </Card>
  );
}
