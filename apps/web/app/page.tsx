"use client";

import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { StyledHome } from "./styles";
import { IDKitButton } from "@/components/IDKitButton/IDKitButton";
import {
  useLeP2PEscrowIsKycVerified,
  useLeP2PEscrowIsVerifiedHuman,
} from "@/generated";

export default function Home() {
  const { address } = useAccount();
  const { connectors } = useConnect();
  const { data: isVerifiedHuman, status: verifiedHumanQueryStatus } =
    useLeP2PEscrowIsVerifiedHuman({
      enabled: !!address,
    });
  const { data: isKycVerified, status: kycVerifiedQueryStatus } =
    useLeP2PEscrowIsKycVerified({});

  const [connectorsReady, setConnectorsReady] = useState(false);

  useEffect(() => {
    setConnectorsReady(connectors.every((connector) => connector.ready));
  }, [connectors]);

  return (
    <StyledHome>
      <h2 className="text-4xl font-bold tracking-tight my-5">
        Welcome, Le P2P :)
      </h2>

      {connectorsReady ? (
        <>
          {address ? (
            <>
              {verifiedHumanQueryStatus === "success" && !isVerifiedHuman && (
                <>
                  <p className="mb-3">Only verified humans can use Le P2P.</p>
                  <IDKitButton />
                </>
              )}
              {kycVerifiedQueryStatus === "success" && !isKycVerified && (
                <>
                  <p className="mb-3">
                    For volume bigger than 1000 USDC, you need to be KYC
                    verified. Please, verify through Polygon ID's VCs.
                  </p>
                  <img src="/polygon-id.png" alt="Polygon ID" />
                </>
              )}
            </>
          ) : (
            <>
              <p className="mb-3">Please connect your wallet:</p>
              <Web3Button />
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </StyledHome>
  );
}
