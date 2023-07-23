"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { StyledBuy } from "./styles";
import OfferCard from "@/components/OfferCard/OfferCard";
import { useSellOffers } from "./service";
import { useLeP2PEscrowReserveOrder } from "@/generated";

export default function Buy() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: sellOffers } = useSellOffers();
  const [reservingOrderId, setReservingOrderId] = useState<string | undefined>();

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  // Contracts
  const reserveCall = useLeP2PEscrowReserveOrder({
    onError: () => setReservingOrderId(undefined),
  });
  const waitingReserve = useWaitForTransaction({
    hash: reserveCall.data?.hash as `0x${string}`,
    onSuccess: () => {
      router.push("/activity");
      setReservingOrderId(undefined);
    },
    confirmations: 2,
  });

  const handleReserveOffer = (offerId: string) => {
    setReservingOrderId(offerId);
    reserveCall.write({
      args: [BigInt(offerId)],
    });
  };

  return (
    <StyledBuy>
      <h2 className="text-4xl font-bold tracking-tight">Buy USDC</h2>

      <div className="offers">
        {sellOffers?.map((sellOffer) => {
          const ownOffer = address?.toLowerCase() === sellOffer.seller.toLowerCase();

          return (
            <div key={sellOffer.id} onClick={!reservingOrderId && !ownOffer ? () => handleReserveOffer(sellOffer.id) : undefined}>
              <OfferCard
                noActions={!!reservingOrderId}
                offer={sellOffer}
                isReserving={(!!reservingOrderId || waitingReserve.isLoading) && reservingOrderId === sellOffer.id}
              />
            </div>
          );
        })}
      </div>
    </StyledBuy>
  );
}
