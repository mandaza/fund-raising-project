import React from "react";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
  border?: boolean;
  shadow?: boolean;
}

export function Card({
  children,
  title,
  className = "",
  padding = "md",
  border = true,
  shadow = true,
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const baseClasses = "bg-white rounded-xl";
  const borderClass = border ? "border border-gray-200" : "";
  const shadowClass = shadow ? "shadow-sm hover:shadow-md transition-shadow duration-200" : "";

  return (
    <div className={`${baseClasses} ${borderClass} ${shadowClass} ${paddingClasses[padding]} ${className}`}>
      {title && <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
