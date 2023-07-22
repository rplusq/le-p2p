"use client";

import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { Button } from "../ui/button";
import { useWorldCoinRegister } from "./service";
import { useAccount } from "wagmi";

export const IDKitButton = () => {
  const { address } = useAccount();
  const { write } = useWorldCoinRegister();

  const handleVerify = (data: any) => {
    console.log(data);
    if (!address) return;
    write({ args: [address, data.merkle_root, data.nullifier_hash, data.proof] });
  };

  return (
    <IDKitWidget
      app_id="app_staging_bfd6e75388e9c05925c3cd5947ef291"
      action="register"
      onSuccess={() => console.log("IDKitWidget Success!")}
      credential_types={[CredentialType.Orb]}
      enableTelemetry
      handleVerify={handleVerify}>
      {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
    </IDKitWidget>
  );
};
