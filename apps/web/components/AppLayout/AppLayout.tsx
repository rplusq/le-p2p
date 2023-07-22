"use client";

import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import { StyledAppLayout } from "./styles";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const pathname = usePathname();

  const noNav = pathname === "/";

  return (
    <StyledAppLayout>
      {address && <AppHeader />}
      <main>{children}</main>
      {!noNav && <BottomNav />}
    </StyledAppLayout>
  );
}
