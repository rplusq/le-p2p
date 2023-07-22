"use client";

import { Web3Button } from "@web3modal/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const { connectors } = useConnect();
  const [connectorsReady, setConnectorsReady] = useState(false);

  console.log("aaaaaaaaa", connectors);

  useEffect(() => {
    if (address) router.push("/buy");
  }, [router, address]);

  useEffect(() => {
    setConnectorsReady(connectors.every((connector) => connector.ready));
  }, [connectors]);

  return (
    <main>
      {connectorsReady ? (
        <>
          <p>Home</p>
          <Web3Button />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
