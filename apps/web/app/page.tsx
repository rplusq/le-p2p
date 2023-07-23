"use client";

import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { StyledHome } from "./styles";
import { IDKitButton } from "@/components/IDKitButton/IDKitButton";
import { useLeP2PEscrowIsKycVerified, useLeP2PEscrowIsVerifiedHuman } from "@/generated";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Verified } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors } = useConnect();
  const {
    data: isVerifiedHuman,
    status: verifiedHumanQueryStatus,
    refetch: refetchIsVerifiedHuman,
  } = useLeP2PEscrowIsVerifiedHuman({
    enabled: !!address,
    account: address,
  });
  const { data: isKycVerified, status: kycVerifiedQueryStatus } = useLeP2PEscrowIsKycVerified({
    enabled: !!address,
    account: address,
  });

  const [connectorsReady, setConnectorsReady] = useState(false);

  useEffect(() => {
    setConnectorsReady(connectors.every((connector) => connector.ready));
  }, [connectors]);

  return (
    <StyledHome>
      <h2 className="text-4xl font-bold tracking-tight my-5">Welcome, Le P2P :)</h2>

      {connectorsReady ? (
        <>
          {address ? (
            <>
              {verifiedHumanQueryStatus === "success" && !isVerifiedHuman && (
                <>
                  <p className="mb-3">Only verified humans can use our app.</p>
                  <IDKitButton refetch={refetchIsVerifiedHuman} />
                </>
              )}
              {isVerifiedHuman && (
                <>
                  <Alert className="mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>KYC Verification.</AlertTitle>
                    <AlertDescription>
                      For volume bigger than <strong>1000 USDC</strong>, you need to be KYC verified. Please, verify through
                      Polygon ID's VCs.
                    </AlertDescription>
                  </Alert>
                  <img width="90%" style={{ margin: "0 auto" }} src="/polygon-id.png" alt="Polygon ID" />
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

      {isVerifiedHuman && (
        <Button onClick={() => router.push("/buy")} className="w-full mt-4">
          Continue to App
        </Button>
      )}
    </StyledHome>
  );
}
