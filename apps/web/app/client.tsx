"use client";
import { init } from "@airstack/airstack-react";

import { QueryClient, QueryClientProvider } from "react-query";
import { FC, PropsWithChildren } from "react";
import { polygonMumbai } from "wagmi/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import StyledComponentsRegistry from "@/lib/styled-components/sc-registry";
import { GlobalStyle } from "@/styles/global.styles";
import { StyledMainApp } from "./styles";
import { Web3Modal } from "@web3modal/react";
import { Toaster } from "@/components/ui/toaster";

export const queryClient = new QueryClient();

const WEB3_MODAL_PROJECT_ID = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ?? "";
const chains = [polygonMumbai];

const { publicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: () => ({
      http: "https://stylish-morning-frog.matic-testnet.discover.quiknode.pro/72948a7ca2aaf4e87bfda38338d9fdecf04843cb/",
    }),
  }),
  w3mProvider({ projectId: WEB3_MODAL_PROJECT_ID }),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: WEB3_MODAL_PROJECT_ID, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? "");

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <StyledMainApp>
            <div className="mobile-container">{children}</div>
          </StyledMainApp>
          <Web3Modal projectId={WEB3_MODAL_PROJECT_ID} ethereumClient={ethereumClient} />
          <Toaster />
        </StyledComponentsRegistry>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default ClientLayout;
