// Chapa payment configuration
export const CHAPA_CONFIG = {
  currency: "ETB",
  baseUrl: "https://api.chapa.co/v1",

  // Supported payment methods shown on Chapa checkout
  paymentMethods: [
    { id: "telebirr", label: "Telebirr", description: "Pay with Telebirr" },
    { id: "cbe_birr", label: "CBE Birr", description: "Pay with CBE Birr" },
    { id: "mpesa", label: "M-Pesa", description: "Pay with M-Pesa" },
    { id: "bank", label: "Bank Transfer", description: "Pay via bank transfer" },
    { id: "card", label: "Credit/Debit Card", description: "Pay with card" },
  ],

  // Test mode amounts (for development)
  testAmounts: [
    { label: "Deposit (10%)", percentage: 0.1 },
    { label: "Full Payment", percentage: 1 },
  ],
} as const;
