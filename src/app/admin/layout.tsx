"use client";

import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar, AdminSidebarToggle } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // prevent scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mobile toggle */}
      <AdminSidebarToggle onToggle={() => setSidebarOpen(true)} />

      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Mobile sidebar (overlay) */}
      {sidebarOpen && (
        <AdminSidebar
          isOverlay
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main className="min-h-screen transition-all duration-300 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
