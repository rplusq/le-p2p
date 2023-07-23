import { Offer } from "@/models/Offer";
import { UseQueryResult, useQuery } from "react-query";
import { useAccount } from "wagmi";

const GET_OFFERS = `
  query {
    offers: orders(where: {status_not: "COMPLETED"}) {
      id
      seller
      buyer
      amount
      fiatToTokenExchangeRate
      iban
      status
      paymentProof
      reason
    }
  }
`;

const getActiveOrderForUser = async (address: string | undefined): Promise<Offer | undefined> => {
  if (!address) return undefined;

  const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
  const resTest = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query: GET_OFFERS }),
    headers: { "Content-Type": "application/json" },
  });
  const dataJson = await resTest.json();

  const offers = dataJson.data.offers as Offer[];
  const myActiveOrder = offers.find(
    (offer: Offer) =>
      offer.buyer?.toLowerCase() === address.toLowerCase() ||
      (offer.seller.toLowerCase() === address.toLowerCase() && ["RESERVED", "PAID"].includes(offer.status))
  );

  return myActiveOrder;
};

export const useActiveOrder = (): UseQueryResult<Offer | undefined> => {
  const { address } = useAccount();

  const queryResult = useQuery({
    queryKey: ["active-order"],
    queryFn: () => getActiveOrderForUser(address),
    enabled: !!address,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  return queryResult;
};
