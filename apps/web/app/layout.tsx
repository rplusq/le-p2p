import "./globals.css";
import { Roboto } from "next/font/google";
import ClientLayout from "./client";
import AppLayout from "@/components/AppLayout/AppLayout";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: {
    default: "Le P2P",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ClientLayout>
          <AppLayout noNav>
            <main>{children}</main>
          </AppLayout>
        </ClientLayout>
      </body>
    </html>
  );
}
