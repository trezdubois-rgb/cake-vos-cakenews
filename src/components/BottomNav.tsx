import { Home, User, MessageSquare, Heart, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Heart, label: 'Mon Flux', href: '/mon-flux' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profil', href: '/profil' },
    { icon: Settings, label: 'Admin', href: '/admin' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="grid grid-cols-5 items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-xs transition-colors px-1',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={20} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;