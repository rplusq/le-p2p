"use client";

import { StyledBottomNav } from "./styles";
import SearchIcon from "@mui/icons-material/ManageSearch";
import HistoryIcon from "@mui/icons-material/History";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <StyledBottomNav>
      <div className={`nav-icon ${pathname === "/search" ? "active" : ""}`} onClick={() => router.push("/search")}>
        <SearchIcon className="icon" />
        <p>Search</p>
      </div>
      <div className={`nav-icon ${pathname === "/activity" ? "active" : ""}`} onClick={() => router.push("/activity")}>
        <HistoryIcon className="icon" />
        <p>Activity</p>
      </div>
    </StyledBottomNav>
  );
}
