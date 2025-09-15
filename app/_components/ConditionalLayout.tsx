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
      <div className="flex flex-1 pt-[65px] overflow-auto">
        <LeftContainer />
        <div className="flex-1 flex flex-col overflow-x-auto overflow-y-auto">
          <main className="flex-1">
            {children}
          </main>
          {(pathname === '/' || pathname === '/live') && <FooterContainer />}
        </div>
      </div>
    </>
  );
}