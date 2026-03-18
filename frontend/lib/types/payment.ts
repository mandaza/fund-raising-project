export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  ECOCASH = "ecocash",
  VISA = "visa",
  OTHER = "other",
}

export enum ProofVerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export interface PaymentProofUpload {
  file: File;
  method: PaymentMethod;
  amount: number;
  currency: string;
  provider_reference?: string;
}

export interface PaymentProofResponse {
  id: string;
  payment_id: string;
  file_path: string;
  original_filename?: string;
  content_type?: string;
  verification_status: ProofVerificationStatus;
  verified_by_admin_id?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface PaymentMethodInfo {
  method: PaymentMethod;
  title: string;
  description: string;
  details: string[];
  icon: string;
}
