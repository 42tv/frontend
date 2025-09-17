'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_lib/stores/userStore";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { fetchUser, isAdminUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      setIsLoading(true);
      
      try {
        // 사용자 정보를 백엔드에서 가져옴
        await fetchUser();
        
        // 백엔드에서 받은 is_admin 값으로 권한 확인
        const hasAdminAccess = isAdminUser();
        
        if (hasAdminAccess) {
          setHasAccess(true);
        } else {
          // admin 권한이 없으면 홈으로 리디렉트
          router.push('/');
          return;
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        router.push('/');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [router, fetchUser, isAdminUser]);

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