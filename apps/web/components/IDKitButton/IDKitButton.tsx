"use client";

import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { useLeP2PEscrowVerifyAndRegister } from "@/generated";
import { decodeAbiParameters } from "viem";

export const IDKitButton = () => {
  const { address } = useAccount();
  const { write } = useLeP2PEscrowVerifyAndRegister();

  const onSuccess = async (proof: any) => {
    if (!address) return;

    const proofDecoded = decodeAbiParameters(
      [{ type: "uint256[8]", name: "x" }],
      proof.proof
    )[0];

    write({
      args: [
        address,
        BigInt(proof.merkle_root),
        BigInt(proof.nullifier_hash),
        proofDecoded as any,
      ],
    });
  };

  return (
    <IDKitWidget
      app_id="app_staging_1031c7704926adf29c35a8f92008a648"
      action="register"
      signal={address}
      onSuccess={onSuccess}
      credential_types={[CredentialType.Orb]}
      enableTelemetry
    >
      {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
    </IDKitWidget>
  );
};
