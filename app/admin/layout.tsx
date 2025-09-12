import AdminLayout from "@/app/_components/admin/AdminLayout";

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}