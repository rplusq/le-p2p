import { Offer } from "@/models/Offer";
import { UseQueryResult, useQuery } from "react-query";

const GET_OFFERS = `
  query {
    offers: orders(where: {status: "STANDBY"}) {
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

const getAllSellOffers = async (): Promise<Offer[]> => {
  const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
  const resTest = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query: GET_OFFERS }),
    headers: { "Content-Type": "application/json" },
  });
  const dataJson = await resTest.json();

  return dataJson.data.offers;
};

export const useSellOffers = (): UseQueryResult<Offer[]> => {
  const queryResult = useQuery({
    queryKey: ["sell-offers"],
    queryFn: () => getAllSellOffers(),
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  return queryResult;
};
