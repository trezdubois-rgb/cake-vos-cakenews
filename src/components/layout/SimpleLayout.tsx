import React from 'react';
import { useLocation } from 'react-router-dom';

import BottomNav from '../BottomNav';
import { Header } from './Header';

/**
 * SimpleLayout Component
 * 
 * Philosophy:
 * - 100% mobile-first design
 * - Clean, minimal interface
 * - Essential features only
 * - Responsive across all screen sizes
 */

interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Admin Layout
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-[calc(100vh-4rem)]">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // User-Facing Layout (Simple & Clean)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content - Mobile-First */}
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default SimpleLayout;