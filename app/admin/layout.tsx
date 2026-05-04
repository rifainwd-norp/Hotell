import { AdminSidebar } from "@/components/admin/sidebar";
import { NotificationManager } from "@/components/admin/NotificationManager";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex relative">
      <NotificationManager />
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
