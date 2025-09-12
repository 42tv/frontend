'use client';
import { useEffect, useState } from "react";
import useUserStore from "@/app/_lib/stores/userStore";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { setIsAdmin } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      setIsLoading(true);
      
      try {
        // 개발용 - admin 권한으로 설정
        setIsAdmin(true);
        
        // UI 개발을 위해 항상 접근 허용
        setHasAccess(true);
      } catch (error) {
        console.error("Admin verification failed:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [setIsAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">접근 권한이 없습니다</h1>
          <p className="text-muted-foreground">관리자 권한이 필요한 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}