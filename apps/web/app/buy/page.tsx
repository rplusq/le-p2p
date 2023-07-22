"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledBuy } from "./styles";
import OfferCard from "@/components/OfferCard/OfferCard";
import { useSellOffers } from "./service";

export default function Buy() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: sellOffers, isLoading } = useSellOffers();

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  return (
    <StyledBuy>
      <h2 className="text-4xl font-bold tracking-tight">Buy USDC</h2>

      <div className="offers">
        {sellOffers?.map((sellOffer) => (
          <OfferCard key={sellOffer.id} offer={sellOffer} />
        ))}
      </div>
    </StyledBuy>
  );
}
