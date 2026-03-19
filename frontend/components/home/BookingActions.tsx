import Link from "next/link";

interface BookingActionsProps {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  primaryVariant?: "primary" | "secondary" | "outline" | "ghost";
  secondaryVariant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}

export function BookingActions({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  primaryVariant = "primary",
  secondaryVariant = "outline",
  size = "lg",
  className = "",
  primaryClassName = "",
  secondaryClassName = "",
}: BookingActionsProps) {
  const baseClasses =
    "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary/30",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/30",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <div className={className}>
      <Link
        href={primaryHref}
        className={`${baseClasses} ${variantClasses[primaryVariant]} ${sizeClasses[size]} ${primaryClassName}`}
      >
        {primaryLabel}
      </Link>
      <Link
        href={secondaryHref}
        className={`${baseClasses} ${variantClasses[secondaryVariant]} ${sizeClasses[size]} ${secondaryClassName}`}
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
