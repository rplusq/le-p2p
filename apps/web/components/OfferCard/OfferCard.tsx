import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StyledOfferCard } from "./styles";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

export default function OfferCard() {
  return (
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="feather feather-refresh-cw">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </CardHeader>
      <CardContent>
        <div>
          <span className="text-xl font-bold">1.2€</span>
          <span className="text-xs text-muted-foreground ml-2">per USDC</span>
        </div>
        <p className="text-xs text-muted-foreground">24€ per 20USDC</p>
      </CardContent>
    </Card>
  );
}
