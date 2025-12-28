import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { SessionDebug } from "@/components/debug/SessionDebug";

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased pb-16">
      <Header />
      <main className="container mx-auto px-0 md:px-4 py-4 max-w-7xl">
        <Outlet />
      </main>
      <BottomNav />
      <SessionDebug />
    </div>
  );
};
