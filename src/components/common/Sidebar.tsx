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
  UserCheck,
  Shield,
  WifiOff,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, offlineQueue, offlineMode } = useApp();
  const pendingCount = offlineQueue.filter((a) => a.status === 'pending').length;

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leagues', label: 'Leagues & Brackets', icon: Trophy },
    { id: 'fixtures', label: 'Fixtures & Scoring', icon: Calendar },
    { id: 'standings', label: 'Standings Table', icon: BarChart3 },
    { id: 'club', label: 'Club & Roster', icon: Users },
    { id: 'store', label: 'Club Store', icon: ShoppingBag },
    {
      id: 'sync',
      label: 'Offline Sync',
      icon: Layers,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
    },
    { id: 'profile', label: 'Profile & Settings', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-64px)]">
      <div className="space-y-6">
        {/* Role badge card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Active Session
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {currentRole}
            </span>
          </div>
          <div className="text-xs font-semibold text-white">
            NaSCon 2026 Operations
          </div>
          {offlineMode && (
            <div className="mt-2 text-[10px] text-amber-300 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              <WifiOff className="w-3 h-3" />
              <span>Staging Offline</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = activeTab === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setActiveTab(it.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{it.label}</span>
                </div>
                {it.badge && (
                  <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-amber-400 text-slate-950">
                    {it.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* University Accreditation Footer */}
      <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400">
        <div className="font-semibold text-white">NaSCon 2026</div>
        <div>FAST National University</div>
        <div className="text-[10px] text-slate-400 mt-1">
          Sports-Tech MVP Prototype v1.0
        </div>
      </div>
    </aside>
  );
};
