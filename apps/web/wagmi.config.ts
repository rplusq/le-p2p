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
            "0xD9a2603aD0be058A5e95172ba542d68E5eE1eb5E",
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
