import { LeP2P_abi } from "@/abis/LeP2P_abi";
import { LE_P2P_ESCROW_ADDRESS } from "@/lib/constans";

import { useContractWrite } from "wagmi";

export const useWorldCoinRegister = () => {
  return useContractWrite({
    abi: LeP2P_abi,
    address: LE_P2P_ESCROW_ADDRESS,
    functionName: "verifyAndRegister",
  });
};
