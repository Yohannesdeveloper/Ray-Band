import type {
  ChapaInitializePayload,
  ChapaInitializeResponse,
  ChapaVerifyResponse,
} from "./types";

const CHAPA_API_BASE = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY!;

/**
 * Generate a unique transaction reference
 */
export function generateTxRef(prefix = "rayband"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Initialize a Chapa payment transaction
 * Returns the checkout_url to redirect the user to
 */
export async function initializePayment(
  payload: ChapaInitializePayload
): Promise<ChapaInitializeResponse> {
  const params = new URLSearchParams();
  params.append("amount", String(payload.amount));
  params.append("currency", payload.currency);
  params.append("email", payload.email);
  params.append("first_name", payload.first_name);
  params.append("last_name", payload.last_name);
  params.append("tx_ref", payload.tx_ref);
  if (payload.phone_number) params.append("phone_number", payload.phone_number);
  if (payload.callback_url) params.append("callback_url", payload.callback_url);
  if (payload.return_url) params.append("return_url", payload.return_url);
  if (payload.customization) {
    if (payload.customization.title) params.append("customization[title]", payload.customization.title);
    if (payload.customization.description) params.append("customization[description]", payload.customization.description);
  }

  const response = await fetch(`${CHAPA_API_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error("Chapa API error:", response.status, JSON.stringify(errorBody));
    throw new Error(
      `Chapa API error ${response.status}: ${JSON.stringify(errorBody)}`
    );
  }

  return response.json();
}

/**
 * Verify a Chapa payment transaction
 */
export async function verifyPayment(
  txRef: string
): Promise<ChapaVerifyResponse> {
  const response = await fetch(
    `${CHAPA_API_BASE}/transaction/verify/${txRef}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ||
        `Chapa verification error: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency = "ETB"): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
