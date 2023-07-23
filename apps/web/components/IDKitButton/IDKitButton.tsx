"use client";

import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { Button } from "../ui/button";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useLeP2PEscrowVerifyAndRegister } from "@/generated";
import { decodeAbiParameters } from "viem";
import { Verified } from "lucide-react";

export const IDKitButton = ({ refetch }: { refetch: any }) => {
  const { address } = useAccount();
  const verifyAndRegisterCall = useLeP2PEscrowVerifyAndRegister();
  useWaitForTransaction({
    hash: verifyAndRegisterCall.data?.hash,
    enabled: !!verifyAndRegisterCall.data?.hash,
    onSuccess: () => {
      refetch();
    },
  });

  const onSuccess = async (proof: any) => {
    if (!address) return;

    const proofDecoded = decodeAbiParameters([{ type: "uint256[8]", name: "x" }], proof.proof)[0];

    verifyAndRegisterCall.write({
      args: [address, BigInt(proof.merkle_root), BigInt(proof.nullifier_hash), proofDecoded as any],
    });
  };

  return (
    <IDKitWidget
      app_id="app_staging_1031c7704926adf29c35a8f92008a648"
      action="register"
      signal={address}
      onSuccess={onSuccess}
      credential_types={[CredentialType.Orb]}
      enableTelemetry>
      {({ open }) => (
        <Button onClick={open} className="w-full">
          <Verified className="mr-2" /> <span>Verify with World ID</span>
        </Button>
      )}
    </IDKitWidget>
  );
};
