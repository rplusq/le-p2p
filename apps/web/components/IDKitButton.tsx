"use client";

import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { Button } from "./ui/button";

export const IDKitButton = () => {
  const handleVerify = (data: any) => {};

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
