import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SportType, League } from '../../types';
import { CreateLeagueModal } from './CreateLeagueModal';
import { LeagueDetailModal } from './LeagueDetailModal';
import {
  Trophy,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const LeaguesView: React.FC = () => {
  const { leagues, currentRole, setActiveTab, setSelectedLeagueId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inspectedLeague, setInspectedLeague] = useState<League | null>(null);

  const sportsFilter: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sports' },
    { id: 'football', label: 'Football' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'badminton', label: 'Badminton' },
  ];

  const filteredLeagues = leagues.filter((league) => {
    const matchesSport = selectedSport === 'all' || league.sport === selectedSport;
    const matchesSearch =
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.season.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sports Tournaments & Leagues
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse sanctioned inter-varsity competitions, tournament formats, and brackets.
          </p>
        </div>

        {(currentRole === 'organizer' || currentRole === 'admin') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New League</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Segmented sport filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto w-full md:w-auto">
          {sportsFilter.map((sf) => (
            <button
              key={sf.id}
              onClick={() => setSelectedSport(sf.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedSport === sf.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournament, format..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* League Cards Grid */}
      {filteredLeagues.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No tournaments found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your sport filter or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredLeagues.map((lg) => (
            <div
              key={lg.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {lg.sport === 'football' && '⚽'}
                      {lg.sport === 'cricket' && '🏏'}
                      {lg.sport === 'basketball' && '🏀'}
                      {lg.sport === 'badminton' && '🏸'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors leading-tight">
                        {lg.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="capitalize">{lg.sport}</span>
                        <span aria-hidden="true">·</span>
                        <span>{lg.season}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded font-mono ${
                      lg.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-blue-500/15 text-blue-300'
                    }`}
                  >
                    {lg.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {lg.description}
                </p>

                {/* Metadata Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Format</div>
                    <div className="font-semibold text-white capitalize truncate text-[11px] mt-0.5">
                      {lg.format}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Teams</div>
                    <div className="font-semibold text-white text-[11px] mt-0.5">
                      {lg.teamsCount} Clubs
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Round</div>
                    <div className="font-semibold text-emerald-400 text-[11px] mt-0.5">
                      {lg.currentRound} / {lg.totalRounds}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectedLeague(lg)}
                  className="text-xs text-slate-300 hover:text-white font-medium"
                >
                  Regulations & Clubs
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedLeagueId(lg.id);
                      setActiveTab('fixtures');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fixtures</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLeagueId(lg.id);
                      setActiveTab('standings');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-transform active:scale-95"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Standings</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateLeagueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <LeagueDetailModal
        league={inspectedLeague}
        isOpen={!!inspectedLeague}
        onClose={() => setInspectedLeague(null)}
      />
    </div>
  );
};
