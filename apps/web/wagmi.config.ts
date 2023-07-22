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
            "0x9B63d91850694D66a7B10F3a0AA2AF74F4AA5631",
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
