"use client";

import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { StyledHome } from "./styles";
import { IDKitButton } from "@/components/IDKitButton/IDKitButton";

export default function Home() {
  const { address } = useAccount();
  const { connectors } = useConnect();
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
              <IDKitButton />
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
