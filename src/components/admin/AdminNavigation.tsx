import { ChevronRight } from 'lucide-react';
import React from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminNavigationProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  children?: React.ReactNode;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ 
  breadcrumbs = [], 
  title, 
  children 
}) => {
  return (
    <div className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Admin</span>
              {breadcrumbs.map((breadcrumb) => {
                const key = breadcrumb.href ?? breadcrumb.label;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" />
                    {breadcrumb.href ? (
                      <a href={breadcrumb.href} className="hover:text-foreground">
                        {breadcrumb.label}
                      </a>
                    ) : (
                      <span className="text-foreground">{breadcrumb.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {children && <div className="flex items-center">{children}</div>}
        </div>
        <div className="py-4">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export { AdminNavigation };