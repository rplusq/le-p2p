"use client";

import { FC, PropsWithChildren } from "react";
import { IDKitWidget, CredentialType } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { log } from "console";

const WorldCoinLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {children}
      <IDKitWidget
        app_id="app_staging_bfd6e75388e9c05925c3cd5947ef291"
        action="register"
        onSuccess={() => console.log("IDKitWidget Success!")}
        credential_types={[CredentialType.Orb]}
        enableTelemetry
        handleVerify={(data: any) => console.log(data)}
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </>
  );
};

export default WorldCoinLayout;
