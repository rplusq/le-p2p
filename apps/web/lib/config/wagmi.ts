"use client";

import { polygon } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";

const WEB3_MODAL_PROJECT_ID = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID ?? "";
const chains = [polygon];

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: WEB3_MODAL_PROJECT_ID }),
  jsonRpcProvider({
    rpc: () => ({ http: process.env.NEXT_PUBLIC_QUICKNODE_HTTP_PROVIDER_URL ?? "" }),
  }),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: WEB3_MODAL_PROJECT_ID, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
