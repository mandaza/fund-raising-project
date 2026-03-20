export interface AdminOverviewBooking {
  id: string;
  reference: string;
  seats: number;
  status: string;
  created_at: string;
  guest?: {
    full_name?: string | null;
    guest_type?: string | null;
  } | null;
}

export interface AdminOverviewViewModel {
  seatsBooked: number;
  amountRaised: number;
  currency: string;
  pendingBookings: number;
  confirmedBookings: number;
  bookings: AdminOverviewBooking[];
}

export interface AdminBookingProof {
  id: string;
  file_path: string;
  original_filename: string | null;
  content_type: string | null;
  verification_status: string;
  rejection_reason: string | null;
  created_at: string;
}

export interface AdminBookingPayment {
  id: string;
  method: string;
  amount: string;
  currency: string;
  paid_at: string | null;
  created_at: string;
  proofs: AdminBookingProof[];
}

export interface AdminBookingDetailViewModel {
  id: string;
  reference: string;
  status: string;
  seats: number;
  notes: string | null;
  created_at: string;
  guest?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    guest_type?: string | null;
  } | null;
  payments: AdminBookingPayment[];
}
