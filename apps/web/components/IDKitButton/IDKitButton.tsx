"use client";

import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { Button } from "../ui/button";
import { useAccount, useContractWrite } from "wagmi";
import { useLeP2PEscrowVerifyAndRegister } from "@/generated";
import { decodeAbiParameters } from "viem";
import { LeP2P_abi } from "@/abis/LeP2P_abi";
import { LE_P2P_ESCROW_ADDRESS } from "@/lib/constans";
import { polygonMumbai } from "viem/chains";
// import { defaultAbiCoder } from "ethers/lib/utils";

export const IDKitButton = () => {
  const { address } = useAccount();
  // const { writeAsync } = useLeP2PEscrowVerifyAndRegister();

  const { writeAsync } = useContractWrite({
    abi: LeP2P_abi,
    functionName: "verifyAndRegister",
    address: LE_P2P_ESCROW_ADDRESS,
    chainId: polygonMumbai.id,
  });

  const handleVerify = async (data: any) => {
    console.log(data);
    if (!address) return;

    const merkleRootDecoded = decodeAbiParameters([{ type: "uint256", name: "y" }], data.merkle_root)[0];
    const nullifierHashDecoded = decodeAbiParameters([{ type: "uint256", name: "z" }], data.nullifier_hash)[0];
    const proofDecoded = decodeAbiParameters([{ type: "uint256[8]", name: "x" }], data.proof)[0];

    try {
      const a = await writeAsync({ args: [address, merkleRootDecoded as any, nullifierHashDecoded as any, proofDecoded as any] });
      console.log(a, "asdasdasd");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <IDKitWidget
      app_id="app_staging_bfd6e75388e9c05925c3cd5947ef291"
      action="register"
      signal={address}
      onSuccess={() => console.log("IDKitWidget Success!")}
      credential_types={[CredentialType.Orb]}
      enableTelemetry
      handleVerify={handleVerify}>
      {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
    </IDKitWidget>
  );
};
