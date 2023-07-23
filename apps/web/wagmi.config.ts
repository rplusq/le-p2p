import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "generated.ts",
  plugins: [
    foundry({
      deployments: {
        LeP2PEscrow: {
          [chains.polygonMumbai.id]:
            "0xb50904f66abe09896f259448a9c9bf783bb4cb77",
        },
        USDCMock: {
          [chains.polygonMumbai.id]:
            "0xB6070545E83827182446F0B00405f04456e594ca",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
