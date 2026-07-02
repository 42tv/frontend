'use client';
import { usePathname } from 'next/navigation';
import Toolbar from './toolbar/toolbar';
import LeftContainer from './left-container/left-container';
import FooterContainer from './footer/footer_container';

interface ConditionalLayoutProps { children: React.ReactNode; }

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  if (isAdminPage) return <>{children}</>;
  return (
    <div className="min-w-[1364px] min-h-screen" style={{ background: '#0d0d10' }}>
      {/* 툴바/사이드바를 sticky로 문서 흐름에 두어 가로 스크롤 시 전체가 함께 움직이도록 함 */}
      <Toolbar />
      <div className="flex">
        <LeftContainer />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          {(pathname === '/' || pathname === '/live') && <FooterContainer />}
        </div>
      </div>
    </div>
  );
}
