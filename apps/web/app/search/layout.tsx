"use client";

import AppLayout from "@/components/AppLayout/AppLayout";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <main>{children}</main>
    </AppLayout>
  );
}
