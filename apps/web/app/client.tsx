"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { FC, PropsWithChildren, useState } from "react";
import { polygonMumbai } from "wagmi/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import StyledComponentsRegistry from "@/lib/styled-components/sc-registry";
import { GlobalStyle } from "@/styles/global.styles";
import { StyledMainApp } from "./styles";
import { Web3Modal } from "@web3modal/react";
import WorldCoinLayout from "./worldCoinLayout";

const WEB3_MODAL_PROJECT_ID =
  process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ?? "";
const chains = [polygonMumbai];

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: WEB3_MODAL_PROJECT_ID }),
  jsonRpcProvider({
    rpc: () => ({
      http: process.env.NEXT_PUBLIC_QUICKNODE_HTTP_PROVIDER_URL ?? "",
    }),
  }),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: WEB3_MODAL_PROJECT_ID, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <StyledMainApp>
            <div className="mobile-container">
              <WorldCoinLayout>{children}</WorldCoinLayout>
            </div>
          </StyledMainApp>
          <Web3Modal
            projectId={WEB3_MODAL_PROJECT_ID}
            ethereumClient={ethereumClient}
          />
        </StyledComponentsRegistry>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default ClientLayout;
