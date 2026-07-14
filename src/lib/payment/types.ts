// Chapa Payment Types
// API: https://api.chapa.co/v1/

export interface ChapaInitializePayload {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title?: string;
    description?: string;
  };
}

export interface ChapaInitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
    tx_ref: string;
  };
}

export interface ChapaVerifyResponse {
  message: string;
  status: string;
  data: {
    tx_ref: string;
    tx_id: string;
    amount: number;
    currency: string;
    charge: number;
    fee: number;
    status: string;
    reference: string;
    customizations: {
      title: string;
      description: string;
    };
    meta: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
}

export type PaymentStatus = "pending" | "success" | "failed";

export interface PaymentRecord {
  txRef: string;
  txId?: string;
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status: PaymentStatus;
  eventType?: string;
  eventDate?: string;
  checkoutUrl?: string;
  createdAt: string;
}
