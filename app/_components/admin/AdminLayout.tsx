'use client';
import AdminGuard from "./AdminGuard";
import AdminNav from "./AdminNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // 더미 사용자 정보
  const nickname = "Admin";
  const role = "admin";

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminNav />
        
        <div className="flex-1 flex flex-col">
          {/* Admin Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">관리자 패널</h1>
                <p className="text-sm text-muted-foreground">시스템 관리 및 설정</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-foreground">{nickname}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {role === 'admin' && '관리자'}
                    {role === 'super_admin' && '최고 관리자'}
                  </p>
                </div>
                
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-accent-foreground">
                    {nickname?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Admin Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}