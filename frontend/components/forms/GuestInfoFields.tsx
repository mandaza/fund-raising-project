import React from "react";
import { Input } from "../ui/Input";

export interface GuestFormData {
  fullName: string;
  email: string;
  phone: string;
}

export interface GuestInfoFieldsProps {
  formData: GuestFormData;
  onChange: (field: keyof GuestFormData, value: string) => void;
  errors: Partial<Record<keyof GuestFormData, string>>;
  disabled?: boolean;
}

export function GuestInfoFields({ formData, onChange, errors, disabled = false }: GuestInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={(value) => onChange("fullName", value)}
        error={errors.fullName}
        required
        placeholder="John Doe"
        disabled={disabled}
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={(value) => onChange("email", value)}
        error={errors.email}
        placeholder="john.doe@example.com"
        helpText="Optional - We'll send booking confirmation to this email"
        disabled={disabled}
      />

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => onChange("phone", value)}
        error={errors.phone}
        placeholder="+273 7x xxx xxxx"
        helpText="Optional - We may contact you for booking updates"
        disabled={disabled}
      />
    </div>
  );
}
