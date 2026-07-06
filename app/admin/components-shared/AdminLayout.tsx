'use client';
import AdminGuard from "./AdminGuard";
import AdminNav from "./AdminNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminNav />

        <div className="flex-1 flex flex-col">
          {/* Admin Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}