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
            "0x195F3cdE1CB48Ab724f68bADfe3165937710A678",
        },
        USDCMock: {
          [chains.polygonMumbai.id]:
            "0xfB82aEe8C684b03Bc2dcCcD221ff104f8A31fDAe",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
