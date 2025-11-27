import { Outlet, useNavigate } from "react-router-dom";
import { AdminBottomNav } from "./AdminBottomNav";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
      <header className="border-b bg-card md:hidden sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin")}>
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>
              Cake Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Voir le site
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto h-auto md:h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <AdminBottomNav />
    </div>
  );
};
