import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchFixture, SportType } from '../../types';
import { MatchDetailModal } from './MatchDetailModal';
import {
  Calendar,
  Clock,
  MapPin,
  Flame,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const FixturesView: React.FC = () => {
  const {
    matches,
    leagues,
    currentRole,
    selectedLeagueId,
    setSelectedLeagueId,
    selectedMatchId,
    setSelectedMatchId,
  } = useApp();

  const [activeTabStatus, setActiveTabStatus] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const inspectedMatch = matches.find((m) => m.id === selectedMatchId) || null;

  const filteredMatches = matches.filter((m) => {
    const matchesStatus =
      activeTabStatus === 'all' || m.status === activeTabStatus;
    const matchesSport = sportFilter === 'all' || m.sport === sportFilter;
    const matchesLeague =
      !selectedLeagueId || m.leagueId === selectedLeagueId;
    const matchesSearch =
      m.homeClubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayClubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.leagueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSport && matchesLeague && matchesSearch;
  });

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const completedCount = matches.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Fixtures & Match Centre
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time match scoring, incident logs, and varsity tournament schedule.
          </p>
        </div>

        {selectedLeagueId && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              Filtered by League
            </span>
            <button
              onClick={() => setSelectedLeagueId(null)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTabStatus('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTabStatus === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTabStatus('live')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTabStatus === 'live'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Live ({liveCount})</span>
          </button>
          <button
            onClick={() => setActiveTabStatus('upcoming')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTabStatus === 'upcoming'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTabStatus('completed')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTabStatus === 'completed'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams, venue..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No matches match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try switching tabs or clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => {
            const isLive = m.status === 'live';
            const isCompleted = m.status === 'completed';

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={`bg-slate-900/85 border rounded-2xl p-4 sm:p-5 shadow-lg transition-all cursor-pointer relative group ${
                  isLive
                    ? 'border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Top Line */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-white capitalize">{m.sport}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate text-slate-300 font-medium">{m.leagueName}</span>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded ${
                      isLive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isCompleted
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-blue-500/15 text-blue-300'
                    }`}
                  >
                    {isLive ? m.period || 'LIVE' : isCompleted ? 'FULL TIME' : m.time}
                  </span>
                </div>

                {/* Main Scoreboard / Teams Line */}
                <div className="grid grid-cols-12 items-center gap-2 py-1">
                  {/* Home */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.homeClubName.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="font-bold text-white text-xs sm:text-sm truncate">
                      {m.homeClubName}
                    </span>
                  </div>

                  {/* Score or VS */}
                  <div className="col-span-2 text-center">
                    {isUpcoming(m.status) ? (
                      <span className="text-xs font-mono text-slate-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        VS
                      </span>
                    ) : (
                      <div className="text-base sm:text-lg font-black text-white font-mono tabular-nums bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {m.homeScore} - {m.awayScore}
                      </div>
                    )}
                  </div>

                  {/* Away */}
                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <span className="font-bold text-white text-xs sm:text-sm truncate">
                      {m.awayClubName}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.awayClubName.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Cricket Specific Overs preview if present */}
                {m.cricketDetails && (
                  <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
                    <span>
                      {m.homeScore}/{m.cricketDetails.homeWickets} ({m.cricketDetails.homeOvers} ov)
                    </span>
                    <span>
                      {m.awayScore}/{m.cricketDetails.awayWickets} ({m.cricketDetails.awayOvers} ov)
                    </span>
                  </div>
                )}

                {/* Footer Strip */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{m.venue}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-300 group-hover:text-emerald-400 font-medium shrink-0 ml-2">
                    <span>
                      {currentRole === 'organizer' || currentRole === 'admin'
                        ? 'Manage Score'
                        : 'View Details'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={inspectedMatch}
        isOpen={!!inspectedMatch}
        onClose={() => setSelectedMatchId(null)}
      />
    </div>
  );
};

function isUpcoming(status: string) {
  return status === 'upcoming';
}
