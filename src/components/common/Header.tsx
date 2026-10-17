import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Trophy,
  Wifi,
  WifiOff,
  Bell,
  Smartphone,
  Monitor,
  ChevronDown,
  LogOut,
  UserCheck,
  RotateCcw,
  Shield,
  Layers,
  X,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    logout,
    offlineMode,
    toggleOfflineMode,
    offlineQueue,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeTab,
    setActiveTab,
    isMobileFrameView,
    setIsMobileFrameView,
    resetDemoData,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingOfflineCount = offlineQueue.filter((a) => a.status === 'pending').length;

  const roles: { role: UserRole; label: string; email: string }[] = [
    { role: 'admin', label: 'Admin', email: 'admin@nascon.test' },
    { role: 'organizer', label: 'Organizer', email: 'organizer@nascon.test' },
    { role: 'manager', label: 'Club Manager', email: 'manager@nascon.test' },
    { role: 'player', label: 'Player', email: 'player@nascon.test' },
    { role: 'viewer', label: 'Viewer', email: 'viewer@nascon.test' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  NaSCon<span className="text-emerald-400">26</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  Sports Ops
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('leagues')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'leagues' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Leagues
            </button>
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'fixtures' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Fixtures & Scoring
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'standings' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Standings
            </button>
            <button
              onClick={() => setActiveTab('club')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'club' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Club & Roster
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                activeTab === 'store' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sync' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              <span>Offline Sync</span>
              {pendingOfflineCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title={`${pendingOfflineCount} queued`} />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary action & controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Frame View Toggle (Mobile Simulation vs Responsive Web) */}
            <button
              onClick={() => setIsMobileFrameView((prev) => !prev)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
              title="Toggle between Responsive Web View and Flutter Mobile Simulation Frame"
            >
              {isMobileFrameView ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Web View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Frame</span>
                </>
              )}
            </button>

            {/* Offline Mode Toggle Button */}
            <button
              onClick={toggleOfflineMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                offlineMode
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700'
              }`}
              title={offlineMode ? 'Offline Simulation Active - click to go online' : 'Click to simulate offline mode'}
            >
              {offlineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline</span>
                  {pendingOfflineCount > 0 && (
                    <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                      {pendingOfflineCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotifDrawerOpen(true)}
              aria-label="Notifications"
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-200 transition-all"
              >
                <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center">
                  {currentUser?.avatar || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-semibold leading-tight text-white capitalize">
                    {currentRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                      Switch Demo Role
                    </div>
                    <div className="font-semibold text-white text-sm mt-0.5 truncate">
                      {currentUser?.name}
                    </div>
                    <div className="text-[11px] text-emerald-400 truncate">
                      {currentUser?.email}
                    </div>
                  </div>

                  <div className="py-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          currentRole === r.role
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{r.label}</div>
                          <div className="text-[10px] text-slate-400">{r.email}</div>
                        </div>
                        {currentRole === r.role && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Profile & Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        setShowResetConfirm(true);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reset Demo Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {notifDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setNotifDrawerOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      n.read
                        ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                        : 'bg-slate-800 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/80">
              <button
                onClick={() => {
                  setNotifDrawerOpen(false);
                  setActiveTab('sync');
                }}
                className="w-full py-2 text-xs text-center font-medium text-emerald-400 hover:underline"
              >
                Inspect Offline Staging & Sync Queue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Reset Demo Data?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              This will restore all clubs, players, leagues, tournament brackets, and store inventory to the initial NaSCon 26 demonstration baseline.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
