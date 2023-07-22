import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";
import { StyledAppLayout } from "./styles";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledAppLayout>
      <AppHeader />
      <main>{children}</main>
      <BottomNav />
    </StyledAppLayout>
  );
}
