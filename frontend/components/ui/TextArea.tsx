import React from "react";

export interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  rows?: number;
  maxLength?: number;
}

export function TextArea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  helpText,
  rows = 4,
  maxLength,
}: TextAreaProps) {
  const hasError = !!error;

  const textareaClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed resize-vertical ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
  }`;

  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
      />

      <div className="flex justify-between mt-1">
        <div>
          {helpText && !hasError && <p className="text-sm text-gray-500">{helpText}</p>}
          {hasError && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {maxLength && (
          <p className={`text-sm ${remainingChars! < 50 ? "text-amber-600" : "text-gray-500"}`}>
            {remainingChars} characters remaining
          </p>
        )}
      </div>
    </div>
  );
}
