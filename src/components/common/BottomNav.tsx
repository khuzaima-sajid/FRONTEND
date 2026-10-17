import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  BarChart3,
  Users,
  ShoppingBag,
  Layers,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, offlineQueue } = useApp();
  const pendingCount = offlineQueue.filter((a) => a.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'leagues', label: 'Leagues', icon: Trophy },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar },
    { id: 'standings', label: 'Table', icon: BarChart3 },
    {
      id: currentRole === 'manager' ? 'club' : currentRole === 'player' ? 'club' : 'store',
      label: currentRole === 'manager' ? 'Roster' : currentRole === 'player' ? 'My Club' : 'Store',
      icon: currentRole === 'manager' || currentRole === 'player' ? Users : ShoppingBag,
    },
    {
      id: 'sync',
      label: 'Sync',
      icon: Layers,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-800 lg:hidden pb-safe">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center min-h-[48px] py-1 text-center relative group"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive
                      ? 'text-emerald-400 scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] bg-amber-400 text-slate-950 font-mono text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap truncate max-w-[50px] ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
