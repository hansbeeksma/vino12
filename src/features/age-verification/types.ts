export type VerificationMethod = "checkbox" | "date_of_birth" | "idin";

export interface AgeVerification {
  id: string;
  session_id: string | null;
  customer_id: string | null;
  method: VerificationMethod;
  verified: boolean;
  date_of_birth: string | null;
  created_at: string;
}

export interface AgeVerificationState {
  isVerified: boolean;
  method: VerificationMethod | null;
  verifiedAt: string | null;
}
