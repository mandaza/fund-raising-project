import { GuestType } from "@/lib/types/booking";

export type BookingWizardType = GuestType.INDIVIDUAL | GuestType.CORPORATE;

export interface BookingWizardFormState {
  bookingType: BookingWizardType;
  tables: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

export interface BookingWizardErrors {
  bookingType?: string;
  tables?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

export interface BookingWizardDerivedState {
  tablesCount: number;
  totalSeats: number;
  totalPrice: number;
  minimumDeposit: number;
  impactMessage: string;
  displayName: string;
}
