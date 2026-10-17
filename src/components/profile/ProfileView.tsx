import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  Shield,
  Settings,
  Bell,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Lock,
  Mail,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Check,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    logout,
    resetDemoData,
    systemConfig,
    updateSystemConfig,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSeason, setActiveSeason] = useState(systemConfig.activeSeason);
  const [scoringWindowOpen, setScoringWindowOpen] = useState(systemConfig.scoringWindowOpen);
  const [registrationOpen, setRegistrationOpen] = useState(systemConfig.registrationOpen);

  const isAdmin = currentRole === 'admin';

  const roles: { role: UserRole; label: string; email: string }[] = [
    { role: 'admin', label: 'Admin', email: 'admin@nascon.test' },
    { role: 'organizer', label: 'Organizer', email: 'organizer@nascon.test' },
    { role: 'manager', label: 'Club Manager', email: 'manager@nascon.test' },
    { role: 'player', label: 'Player', email: 'player@nascon.test' },
    { role: 'viewer', label: 'Viewer', email: 'viewer@nascon.test' },
  ];

  const handleSaveAdminConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      activeSeason,
      scoringWindowOpen,
      registrationOpen,
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          User Account & Platform Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review profile credentials, switch roles, or manage administrative governance parameters.
        </p>
      </div>

      {/* User Details Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-2xl flex items-center justify-center">
            {currentUser?.avatar || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {currentRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
            {currentUser?.clubName && (
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Franchise: {currentUser.clubName}
                {currentUser.jerseyNumber && ` · Squad #${currentUser.jerseyNumber}`}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Role Switcher Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-1">
          Switch Demo Role
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select any of the 5 demo personas to immediately experience their tailored UI and permission set.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {roles.map((r) => {
            const isActive = currentRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-800 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{r.label}</span>
                  {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {r.email}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin-Only Platform Governance Panel */}
      {isAdmin ? (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Admin Platform Governance
                </h3>
                <span className="text-[11px] text-slate-400">
                  Global tournament rules, sanctioning window, and database resets
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              ADMINISTRATOR ONLY
            </span>
          </div>

          <form onSubmit={handleSaveAdminConfig} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Active Tournament Season Banner
              </label>
              <input
                type="text"
                value={activeSeason}
                onChange={(e) => setActiveSeason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Live Match Scoring Window</div>
                  <div className="text-[10px] text-slate-400">Allow organizers to submit live scores</div>
                </div>
                <input
                  type="checkbox"
                  checked={scoringWindowOpen}
                  onChange={(e) => setScoringWindowOpen(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Club Roster Registrations</div>
                  <div className="text-[10px] text-slate-400">Permit managers to add new players</div>
                </div>
                <input
                  type="checkbox"
                  checked={registrationOpen}
                  onChange={(e) => setRegistrationOpen(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-transform active:scale-95"
              >
                Save System Governance
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Admin configuration controls are restricted to the <strong>Admin</strong> role.</span>
          <button
            onClick={() => switchRole('admin')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Switch to Admin Persona →
          </button>
        </div>
      )}

      {/* Reset Demo Data Card */}
      <div className="bg-slate-900/80 border border-rose-500/20 rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Restore Tournament Benchmark Baseline</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset all leagues, matches, scores, player rosters, and orders to the original university demo state.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs whitespace-nowrap transition-colors"
        >
          Reset Demo Data
        </button>
      </div>

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reset All Demo Data?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              This will restore all clubs, players, leagues, tournament brackets, and store inventory to the initial NaSCon 26 demonstration baseline.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
