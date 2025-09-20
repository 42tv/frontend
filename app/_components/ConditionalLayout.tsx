'use client';
import { usePathname } from "next/navigation";
import Toolbar from "./toolbar/toolbar";
import LeftContainer from "./left-container/left-container";
import FooterContainer from "./footer/footer_container";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Admin 페이지는 완전히 독립적인 레이아웃
    return <>{children}</>;
  }

  // 일반 페이지는 기존 레이아웃 사용
  return (
    <>
      <Toolbar />
      <div className="bg-background min-w-[1364px] min-h-screen">
        <div className="flex pt-[65px]">
          <LeftContainer />
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            {(pathname === '/' || pathname === '/live') && <FooterContainer />}
          </div>
        </div>
      </div>
    </>
  );
}