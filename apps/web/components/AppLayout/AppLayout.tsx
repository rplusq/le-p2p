"use client";

import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import { StyledAppLayout } from "./styles";
import { useAccount } from "wagmi";

export default function AppLayout({ children, noNav = false }: { children: React.ReactNode; noNav?: boolean }) {
  const { address } = useAccount();

  return (
    <StyledAppLayout>
      {address && <AppHeader />}
      <main>{children}</main>
      {!noNav && <BottomNav />}
    </StyledAppLayout>
  );
}
