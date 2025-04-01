"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import DecentRoute from "@/components/routes/DecentRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <DecentRoute>
      <SidebarProvider>
        <AppSidebar isCollapsed={isCollapsed} />

        <div className="w-full">
          <div
            className="mt-[10px] ml-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <SidebarTrigger />
          </div>
          <div className="p-4">{children}</div>
        </div>
      </SidebarProvider>
    </DecentRoute>
  );
}
