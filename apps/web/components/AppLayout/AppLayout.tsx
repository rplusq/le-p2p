import BottomNav from "./BottomNav";
import { StyledAppLayout } from "./styles";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledAppLayout>
      <main>{children}</main>
      <BottomNav />
    </StyledAppLayout>
  );
}
