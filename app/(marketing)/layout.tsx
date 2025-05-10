import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavMobile } from "@/components/layout/mobile-nav";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1 relative z-10 pt-14">{children}</main>
      <SiteFooter className="relative z-10" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundBeams />
      </div>
    </div>
  );
}
