import { BOOKING_REFERENCE, FILE_UPLOAD } from "./constants";

export function validateEmail(email: string): boolean {
  if (!email) return true; // Email is optional
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  // Allow various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
  const phonePattern = /^[\d\s\-\(\)\+]+$/;
  return phonePattern.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

export function validateBookingReference(ref: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = ref.trim().toUpperCase();

  if (!trimmed) {
    return { isValid: false, error: "Booking reference is required" };
  }

  if (!BOOKING_REFERENCE.PATTERN.test(trimmed)) {
    return {
      isValid: false,
      error: `Invalid format. Expected: ${BOOKING_REFERENCE.EXAMPLE}`,
    };
  }

  return { isValid: true };
}

export function validateFileSize(file: File, maxSize: number = FILE_UPLOAD.MAX_SIZE): boolean {
  return file.size <= maxSize;
}

export function validateFileType(
  file: File,
  allowedTypes: readonly string[] = FILE_UPLOAD.ALLOWED_TYPES
): boolean {
  return allowedTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
