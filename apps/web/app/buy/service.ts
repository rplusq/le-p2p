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

interface SellerStatus {
  [seller: string]: boolean;
}

const getAllSellOffers = async (): Promise<Offer[]> => {
  const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
  const resTest = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query: GET_OFFERS }),
    headers: { "Content-Type": "application/json" },
  });
  const dataJson = await resTest.json();

  const sellers = [
    ...new Set(dataJson.data.offers.map((offer: Offer) => offer.seller)),
  ];

  const promises = sellers.map(async (seller) => {
    const res = await fetch("https://api.airstack.xyz/gql", {
      method: "POST",
      body: JSON.stringify({
        query: `query MyQuery($seller: Identity!) {
          Wallet(input: {identity: $seller, blockchain: ethereum}) {
            socials {
              dappName
              profileName
            }
            domains {
              name
            }
            primaryDomain {
              name
            }
            addresses
            xmtp {
              isXMTPEnabled
            }
          }
        }
        `,
        variables: {
          seller,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? "",
      },
    });

    const airstackDataJson = await res.json();
    const isXMTPEnabled = airstackDataJson.data.Wallet.xmtp[0]?.isXMTPEnabled;
    return { seller, isXMTPEnabled };
  });

  const results = await Promise.all(promises);
  const sellerDict: SellerStatus = {};
  results.forEach((result) => {
    sellerDict[result.seller as any] = result.isXMTPEnabled;
  });

  dataJson.data.offers.forEach((offer: Offer) => {
    offer.isXMTPEnabled = sellerDict[offer.seller];
  });

  return dataJson.data.offers;
};

export const useSellOffers = (): UseQueryResult<Offer[]> => {
  const queryResult = useQuery({
    queryKey: ["offers"],
    queryFn: () => getAllSellOffers(),
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  return queryResult;
};
