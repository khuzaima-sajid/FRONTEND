import React from 'react';
import { useApp } from '../../context/AppContext';
import { League } from '../../types';
import {
  Trophy,
  X,
  Calendar,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface LeagueDetailModalProps {
  league: League | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeagueDetailModal: React.FC<LeagueDetailModalProps> = ({
  league,
  isOpen,
  onClose,
}) => {
  const { clubs, matches, setActiveTab, setSelectedLeagueId } = useApp();

  if (!isOpen || !league) return null;

  const leagueClubs = clubs.filter((c) => league.teams.includes(c.id));
  const leagueMatches = matches.filter((m) => m.leagueId === league.id);
  const completedCount = leagueMatches.filter((m) => m.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-tight">
                  {league.name}
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {league.status}
                </span>
              </div>
              <span className="text-xs text-slate-400 capitalize">
                {league.sport} · {league.format} · {league.season}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
              Overview & Regulations
            </h4>
            <p className="leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {league.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Teams</div>
              <div className="text-lg font-bold text-white font-mono">{league.teamsCount}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Completed</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {completedCount} / {leagueMatches.length}
              </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Round</div>
              <div className="text-lg font-bold text-white font-mono">
                {league.currentRound} of {league.totalRounds}
              </div>
            </div>
          </div>

          {/* Participating Clubs List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Participating Teams ({leagueClubs.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {leagueClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${club.primaryColor}20`, color: club.primaryColor }}
                  >
                    {club.code}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{club.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{club.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules Specifications */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Points for Win:</span>
              <span className="text-white font-bold">{league.pointsPerWin} points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Points for Draw:</span>
              <span className="text-white font-bold">{league.pointsPerDraw} points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Schedule Window:</span>
              <span className="text-slate-200">{league.startDate} to {league.endDate}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setSelectedLeagueId(league.id);
              setActiveTab('fixtures');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fixtures & Scoring</span>
          </button>
          <button
            onClick={() => {
              onClose();
              setSelectedLeagueId(league.id);
              setActiveTab('standings');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Standings Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
