export type Offer = {
  id: string;
  seller: string;
  amount: string;
  fiatToTokenExchangeRate: string;
  iban: string;
  buyer?: string;
  paymentProof?: string;
  status: "STANDBY" | "PAID" | "COMPLETED" | "CANCELLED" | "RESERVED";
  reason?: string;
  isXMTPEnabled?: boolean;
};
