import { Offer } from "@/models/Offer";
import { UseQueryResult, useQuery } from "react-query";

const getActiveOrderForUser = async (): Promise<Offer | undefined> => {
  const buyerAction = {
    id: 0,
    amount: 10,
    seller: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
    buyer: "0xC9a59cA7b04D623B522f688f7b01F9670B5cF204",
    fiatToTokenExchangeRate: 1.12,
    iban: "LU 28 001 94006447500003",
    paymentProof: "",
  };
  const buyerWaiting = {
    id: 0,
    amount: 10,
    seller: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
    buyer: "0xC9a59cA7b04D623B522f688f7b01F9670B5cF204",
    fiatToTokenExchangeRate: 1.12,
    iban: "LU 28 001 94006447500003",
    paymentProof: "test",
  };
  const sellerAction = {
    id: 0,
    amount: 10,
    seller: "0xC9a59cA7b04D623B522f688f7b01F9670B5cF204",
    buyer: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
    fiatToTokenExchangeRate: 1.12,
    iban: "LU 28 001 94006447500003",
    paymentProof: "test",
  };
  const sellerWaiting = {
    id: 0,
    amount: 10,
    seller: "0xC9a59cA7b04D623B522f688f7b01F9670B5cF204",
    buyer: "0xd77DEd1CF30847d51e46f6f6C8cbFef0b7abB5Bf",
    fiatToTokenExchangeRate: 1.12,
    iban: "LU 28 001 94006447500003",
    paymentProof: "",
  };

  return buyerAction;
};

export const useActiveOrder = (): UseQueryResult<Offer | undefined> => {
  const queryResult = useQuery({
    queryKey: ["active-order"],
    queryFn: () => getActiveOrderForUser(),
  });

  return queryResult;
};
