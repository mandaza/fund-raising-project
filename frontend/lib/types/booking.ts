export enum GuestType {
  INDIVIDUAL = "individual",
  CORPORATE = "corporate",
  SPONSOR = "sponsor",
  VIP = "vip",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface GuestCreate {
  full_name: string;
  email?: string;
  phone?: string;
  guest_type: GuestType;
}

export interface GuestRead {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  guest_type: GuestType;
  created_at: string;
  updated_at: string;
}

export interface BookingResponse {
  id: string;
  guest_id: string;
  reference: string;
  status: BookingStatus;
  seats: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  guest?: GuestRead;
}

export interface CorporateBookingRequest {
  guest: GuestCreate;
  tables: number;
  notes?: string;
}

export interface IndividualBookingRequest {
  guest: GuestCreate;
  notes?: string;
}
