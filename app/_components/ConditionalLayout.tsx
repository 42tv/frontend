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
    <>
      <Toolbar />
      <div className="min-w-[1364px] min-h-screen" style={{ background: '#0d0d10' }}>
        <div className="flex pt-[65px]">
          <LeftContainer />
          <div className="flex-1 flex flex-col ml-[200px]">
            <main className="flex-1">{children}</main>
            {(pathname === '/' || pathname === '/live') && <FooterContainer />}
          </div>
        </div>
      </div>
    </>
  );
}
