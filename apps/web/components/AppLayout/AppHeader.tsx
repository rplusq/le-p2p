"use client";

import { Web3Button } from "@web3modal/react";
import { Button } from "../ui/button";
import { StyledAppHeader } from "./styles";
import { useAccount, useBalance, useConnect } from "wagmi";
import millify from "millify";
import { useEffect, useState } from "react";
import { usdcMockAddress } from "@/generated";
import * as PushAPI from "@pushprotocol/restapi";
import { polygonMumbai } from "wagmi/chains";
import BellIcon from "@mui/icons-material/NotificationsNone";
import { useToast } from "../ui/use-toast";

export default function AppHeader() {
  const { address } = useAccount();
  const { connectors } = useConnect();
  const usdcBalance = useBalance({ address, token: usdcMockAddress[polygonMumbai.id] });
  const { toast } = useToast();
  const [connectorsReady, setConnectorsReady] = useState(false);

  useEffect(() => {
    setConnectorsReady(connectors.every((connector) => connector.ready));
  }, [connectors]);

  const handleOptIn = async () => {
    await PushAPI.channels.subscribe({
      signer: await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })[0],
      channelAddress: `eip155:${polygonMumbai.id}:0x7fc524F99e8b3d91dA6E387A3cF2898885e2A2Ee`,
      userAddress: `eip155:${polygonMumbai.id}:${address}`,
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Opt-in success",
          description: "You will now receive notifications for this channel.",
        });
      },
      onError: (err) => {
        console.log(err);
        console.error("opt in error");
      },
      env: "staging" as PushAPI.Env,
    });
  };

  return (
    connectorsReady && (
      <StyledAppHeader>
        <Button variant="secondary" className="px-3 shadow-none">
          <svg
            data-name="86977684-12db-4850-8f30-233a7c267d11"
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            viewBox="0 0 2000 2000">
            <path
              d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"
              fill="#2775ca"
            />
            <path
              d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z"
              fill="#fff"
            />
            <path
              d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"
              fill="#fff"
            />
          </svg>
          <span className="font-bold ml-2">{millify(+(usdcBalance.data?.formatted ?? 0))}</span>
        </Button>
        <div>
          <Button variant="outline" className="mr-3" onClick={handleOptIn}>
            <BellIcon className="h-4 w-4" />
            Push Opt-in
          </Button>
          <Web3Button />
        </div>
      </StyledAppHeader>
    )
  );
}
