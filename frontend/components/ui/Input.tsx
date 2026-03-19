import React from "react";

export interface InputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "number";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  min?: number;
  max?: number;
}

export function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  helpText,
  min,
  max,
}: InputProps) {
  const hasError = !!error;

  const inputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
  }`;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className={inputClasses}
      />

      {helpText && !hasError && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}

      {hasError && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
