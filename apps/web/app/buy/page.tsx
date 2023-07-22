"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledBuy } from "./styles";
import OfferCard from "@/components/OfferCard/OfferCard";

export default function Buy() {
  const router = useRouter();
  const { address } = useAccount();
  console.log(address);

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  return (
    <StyledBuy>
      <h2 className="text-4xl font-bold tracking-tight">Buy USDC</h2>

      <div className="offers">
        <OfferCard />
        <OfferCard />
        <OfferCard />
        <OfferCard />
        <OfferCard />
        <OfferCard />
        <OfferCard />
        <OfferCard />
      </div>
    </StyledBuy>
  );
}
