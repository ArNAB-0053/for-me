import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        className="max-lg:flex max-lg:flex-col"
      >
        <AppSidebar variant="inset" />
        <div className="lg:hidden flex items-center justify-between px-4 mt-2">
          <Link href="mydashboard" className="bg-zinc-700 rounded-full px-3 py-2">My Dashboard</Link>
          <Link href="manage-finances" className="bg-zinc-700 rounded-full px-3 py-2">Manage Finances</Link>
          {/* <Link href="/mydashboard">My Dashboard</Link> */}
        </div>
        <SidebarInset>{children}</SidebarInset>
        <Toaster />
      </SidebarProvider>
    </div>
  );
};

export default ProtectedLayout;
