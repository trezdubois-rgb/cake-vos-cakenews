import { Outlet, useNavigate } from "react-router-dom";
import { AdminBottomNav } from "./AdminBottomNav";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Header - Hidden on Desktop */}
      <header className="border-b bg-card/80 backdrop-blur-md md:hidden sticky top-0 z-40 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin")}>
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Cake Admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto h-auto md:h-screen bg-muted/10">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <AdminBottomNav />
    </div>
  );
};
