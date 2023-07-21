"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledActivity } from "./styles";

export default function Activity() {
  const router = useRouter();
  const { address } = useAccount();
  console.log(address);

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  return (
    <StyledActivity>
      <h2>Activity</h2>
    </StyledActivity>
  );
}
