"use client";

import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import { StyledAppLayout } from "./styles";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import * as PushAPI from "@pushprotocol/restapi";
import { useEffect, useState } from "react";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { polygonMumbai } from "wagmi/chains";
import { useToast } from "../ui/use-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const pathname = usePathname();
  const [sdkSocket, setSDKSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(sdkSocket?.connected);

  console.log(isConnected);
  const noNav = pathname === "/";

  const addSocketEvents = () => {
    sdkSocket?.on(EVENTS.CONNECT, () => {
      setIsConnected(true);
    });

    sdkSocket?.on(EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    sdkSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      console.log(feedItem);
      toast({
        variant: "default",
        title: "Push protocol notification",
        description: feedItem.payload.data.amsg,
      });
    });
  };

  const removeSocketEvents = () => {
    sdkSocket?.off(EVENTS.CONNECT);
    sdkSocket?.off(EVENTS.DISCONNECT);
  };

  const toggleConnection = () => {
    if (sdkSocket?.connected) {
      sdkSocket.disconnect();
    } else {
      sdkSocket.connect();
    }
  };

  useEffect(() => {
    if (sdkSocket) {
      addSocketEvents();
    }
    return () => {
      removeSocketEvents();
    };
  }, [sdkSocket]);

  useEffect(() => {
    const connectionObject = createSocketConnection({
      user: `eip155:${polygonMumbai.id}:${address}`,
      env: "staging" as PushAPI.Env,
      socketOptions: { autoConnect: true },
    });

    setSDKSocket(connectionObject);

    return () => {
      if (sdkSocket) sdkSocket.disconnect();
    };
  }, []);

  return (
    <StyledAppLayout>
      {address && <AppHeader />}
      <main>{children}</main>
      {!noNav && <BottomNav />}
    </StyledAppLayout>
  );
}
