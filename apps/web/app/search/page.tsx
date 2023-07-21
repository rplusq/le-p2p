"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledSearch } from "./styles";

export default function Search() {
  const router = useRouter();
  const { address } = useAccount();
  console.log(address);

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  return (
    <StyledSearch>
      <h2>Search</h2>
    </StyledSearch>
  );
}
