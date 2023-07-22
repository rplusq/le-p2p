import { Offer } from "@/models/Offer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StyledOfferCard } from "./styles";
import { zeroAddress } from "viem";

type OfferCardProps = {
  offer: Offer;
};

export default function OfferCard({ offer }: OfferCardProps) {
  return (
    <StyledOfferCard disabled={offer.buyer !== zeroAddress}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buy USDC with EURO</CardTitle>
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
            className="feather feather-refresh-cw">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div>
            <span className="text-xl font-bold">{offer?.fiatToTokenExchangeRate}€</span>
            <span className="text-xs text-muted-foreground ml-2">per USDC</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {((offer?.amount ?? 0) * (offer?.fiatToTokenExchangeRate ?? 0)).toFixed(2)}€ per {offer?.amount.toFixed(2)}USDC
          </p>
        </CardContent>
      </Card>
    </StyledOfferCard>
  );
}
