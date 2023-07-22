"use client";

import { StyledBottomNav } from "./styles";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <StyledBottomNav>
      <div className={`nav-icon ${pathname === "/buy" ? "active" : ""}`} onClick={() => router.push("/buy")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-down-left">
          <line x1="17" y1="7" x2="7" y2="17"></line>
          <polyline points="17 17 7 17 7 7"></polyline>
        </svg>
        <p>Buy USDC</p>
      </div>
      <div className={`nav-icon ${pathname === "/activity" ? "active" : ""}`} onClick={() => router.push("/activity")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <p>Activity</p>
      </div>
      <div className={`nav-icon ${pathname === "/sell" ? "active" : ""}`} onClick={() => router.push("/sell")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-up-right">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <p>Sell USDC</p>
      </div>
    </StyledBottomNav>
  );
}
