"use client";

import { WagmiConfig } from "wagmi";
import StyledComponentsRegistry from "@/lib/styled-components/sc-registry";
import { GlobalStyle } from "@/styles/global.styles";
import { Roboto } from "next/font/google";
import { ethereumClient, wagmiConfig } from "@/lib/config/wagmi";
import { Web3Modal } from "@web3modal/react";
import { StyledMainApp } from "./styles";

const WEB3_MODAL_PROJECT_ID = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ?? "";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <WagmiConfig config={wagmiConfig}>
            <StyledMainApp>
              <div className="mobile-container">{children}</div>
            </StyledMainApp>
          </WagmiConfig>
          <Web3Modal projectId={WEB3_MODAL_PROJECT_ID} ethereumClient={ethereumClient} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
