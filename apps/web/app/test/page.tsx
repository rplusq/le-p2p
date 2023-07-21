"use client";

import { Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";

export default function Test() {
  const { address } = useAccount();
  console.log(address);

  return (
    <div>
      <p>test</p>
      <Web3Button />
    </div>
  );
}
