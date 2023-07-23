"use client";

import { Offer } from "@/models/Offer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StyledOfferCard } from "./styles";
import { formatUnits, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { TOKEN_DECIMALS } from "@/lib/constans";

type OfferCardProps = {
  offer: Offer;
  noActions?: boolean;
  isReserving?: boolean;
};

export default function OfferCard({
  offer,
  isReserving = false,
  noActions = false,
}: OfferCardProps) {
  const { address } = useAccount();
  const ownOffer = address?.toLowerCase() === offer.seller.toLowerCase();

  const amountFormatted = formatUnits(BigInt(offer.amount), TOKEN_DECIMALS);
  const exchangeRateFormatted = formatUnits(
    BigInt(offer.fiatToTokenExchangeRate),
    TOKEN_DECIMALS
  );

  const handleCreateOrder = () => {
    // TODO:
    // Call contract
  };

  if (!offer) return null;

  return (
    <StyledOfferCard
      isReserving={isReserving}
      ownOffer={ownOffer}
      noActions={noActions}
      disabled={false}
      onClick={handleCreateOrder}
    >
      <Card className="offer-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <span>Buy USDC with EURO</span>
          </CardTitle>
          {ownOffer ? (
            <>
              <span className="text-sm  font-bold text-pink-500 mb-5">
                YOUR OFFER
              </span>
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-refresh-cw"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          )}
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-xl font-bold">{exchangeRateFormatted}€</span>
            <span className="text-xs text-muted-foreground ml-2">per USDC</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {(+amountFormatted / +exchangeRateFormatted).toFixed(2)}€ per{" "}
            {(+amountFormatted).toFixed(2)}USDC
          </p>
        </CardContent>
      </Card>
    </StyledOfferCard>
  );
}
