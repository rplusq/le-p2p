import { Offer } from "@/models/Offer";
import { UseQueryResult, useQuery } from "react-query";
import { zeroAddress } from "viem";

const getAllSellOffers = async (): Promise<Offer[]> => {
  return [
    {
      id: 0,
      amount: 10,
      seller: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
      buyer: zeroAddress,
      fiatToTokenExchangeRate: 1.12,
      iban: "LU 28 001 94006447500003",
      paymentProof: "",
    },
    {
      id: 2,
      amount: 15,
      seller: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
      buyer: zeroAddress,
      fiatToTokenExchangeRate: 1.13,
      iban: "LU 28 001 94006447500034",
      paymentProof: "",
    },
    {
      id: 3,
      amount: 18.6,
      seller: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
      buyer: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
      fiatToTokenExchangeRate: 1.16,
      iban: "LU 28 001 940064475000349",
      paymentProof: "",
    },
  ];
};

export const useSellOffers = (): UseQueryResult<Offer[]> => {
  const queryResult = useQuery({
    queryKey: ["sell-offers"],
    queryFn: () => getAllSellOffers(),
  });

  return queryResult;
};
