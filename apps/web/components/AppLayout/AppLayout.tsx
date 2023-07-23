"use client";

import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import { StyledAppLayout } from "./styles";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import * as PushAPI from "@pushprotocol/restapi";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const pathname = usePathname();

  const noNav = pathname === "/";
  useEffect(() => {
    const getNotifications = async () => {
      const notifications = await PushAPI.user.getFeeds({
        user: `eip155:80001:${address}`, // user address in CAIP
        env: "staging" as PushAPI.Env,
      });
      console.log(notifications);
    };
    getNotifications();
  }, []);
  return (
    <StyledAppLayout>
      {address && <AppHeader />}
      <main>{children}</main>
      {!noNav && <BottomNav />}
    </StyledAppLayout>
  );
}
