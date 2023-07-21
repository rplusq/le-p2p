"use client";

import AppLayout from "@/components/AppLayout/AppLayout";

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <main>{children}</main>
    </AppLayout>
  );
}
