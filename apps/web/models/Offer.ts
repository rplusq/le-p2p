export type Offer = {
  id: number;
  seller: string;
  amount: number;
  fiatToTokenExchangeRate: number;
  iban: string;
  buyer: string;
  paymentProof: string;
};
