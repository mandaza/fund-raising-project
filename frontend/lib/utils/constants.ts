import { PaymentMethod, PaymentMethodInfo } from "../types/payment";

// Pricing constants
export const PRICING = {
  INDIVIDUAL_SEAT: 100,
  INDIVIDUAL_MIN_DEPOSIT: 50,
  CORPORATE_TABLE: 1000,
  CORPORATE_MIN_DEPOSIT: 100,
  SEATS_PER_TABLE: 10,
  CURRENCY: "USD",
} as const;

// Event information
export const EVENT_INFO = {
  name: "MOSH Fundraising Dinner",
  tagline: "Empowering Children with Special Needs in Zimbabwe",
  date: "2026-04-03",
  time: "18:00",
  venue: "1 Pennefather Avenue in Harare, Zimbabwe",
  address: "1 Pennefather Avenue in Harare, Zimbabwe",
  description:
    "Join Mothers of Special Heroes (MOSH) in creating a more inclusive future for children with neurological disabilities.",
} as const;

// Payment methods with detailed information
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    method: PaymentMethod.BANK_TRANSFER,
    title: "Bank Transfer",
    description: "Transfer directly to our bank account",
    details: [
      "Bank Name: ZB Bank",
      "Account Name: Mothers of Special Heroes Zimbabwe",
      "Account Number: 430700036233405",
      "Reference: Your Booking Reference",
    ],
    icon: "🏦",
  },
  {
    method: PaymentMethod.ECOCASH,
    title: "EcoCash",
    description: "Pay via EcoCash mobile money",
    details: [
      "EcoCash Number: +263783019160",
      "Account Name: Talent Mazombe",
      "Reference: Your Booking Reference",
    ],
    icon: "📱",
  },
  {
    method: PaymentMethod.CASH,
    title: "Cash Payment",
    description: "Pay in person at our office",
    details: [
      "Office Address: 123 Main Street, Suite 100",
      "Office Hours: Monday-Friday, 9:00 AM - 5:00 PM",
      "Contact: (555) 123-4567",
      "Bring your booking reference",
      "Request a receipt",
    ],
    icon: "💵",
  },
  {
    method: PaymentMethod.VISA,
    title: "Card Payment",
    description: "Pay with Visa or Mastercard",
    details: [
      "Contact our office to arrange card payment",
      "Phone: (555) 123-4567",
      "Email: payments@fundraising.org",
      "Secure payment processing available",
    ],
    icon: "💳",
  },
];

// File upload configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
} as const;

// Booking reference format
export const BOOKING_REFERENCE = {
  PREFIX: "FR",
  LENGTH: 10,
  PATTERN: /^[A-Z]{2}-[A-Z0-9]{10}$/,
  EXAMPLE: "FR-1A2B3C4D5E",
} as const;

// Contact information
export const CONTACT_INFO = {
  email: "info@mothersofspecialheroes.org",
  phone: "0783019160 or 0773618337 (WhatsApp)",
  address: "Fidelity Life Centre, Fife Street and 11th Ave",
} as const;
