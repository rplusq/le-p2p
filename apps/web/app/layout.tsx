"use client";

import { WagmiConfig } from "wagmi";
import StyledComponentsRegistry from "../lib/styled-components/sc-registry";
import { GlobalStyle } from "../styles/global.styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ethereumClient, wagmiConfig } from "../lib/config/wagmi";
import { Web3Modal } from "@web3modal/react";

const WEB3_MODAL_PROJECT_ID = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ?? "";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Le P2P",
//   description:
//     "Sybil-resistant decentralized fiat on-ramp for crypto that allows users to trade fiat for crypto through a smart-contract escrow.",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
          <Web3Modal projectId={WEB3_MODAL_PROJECT_ID} ethereumClient={ethereumClient} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
