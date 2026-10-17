import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  Users,
  PlusCircle,
  Activity,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Shield,
  Clock,
  MapPin,
  Flame,
  ChevronRight,
  WifiOff,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    leagues,
    matches,
    clubs,
    players,
    setActiveTab,
    setSelectedMatchId,
    setSelectedLeagueId,
    setSelectedClubId,
    offlineMode,
  } = useApp();

  const activeLeaguesCount = leagues.filter((l) => l.status === 'Active').length;
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const liveMatches = matches.filter((m) => m.status === 'live');
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const registeredClubsCount = clubs.length;

  const userClub = clubs.find((c) => c.id === currentUser?.clubId) || clubs[0];
  const userPlayer = players.find((p) => p.name === currentUser?.name) || players[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0D1B2A] to-slate-900 shadow-xl">
        {/* Background photo overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-luminosity">
          <img
            src="/src/assets/images/nascon_hero_banner_1792218064945.jpg"
            alt="Sports stadium lighting"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 p-5 sm:p-7 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  {currentRole.toUpperCase()} PORTAL
                </span>
                {offlineMode && (
                  <span className="text-xs uppercase font-mono font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Offline Local Staging
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Guest'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {currentRole === 'organizer' &&
                  'NaSCon 26 tournament command center. Manage fixtures, record scores, and sanction brackets.'}
                {currentRole === 'manager' &&
                  `Directing ${userClub.name}. Oversee active player roster, transfers, and merchandise.`}
                {currentRole === 'player' &&
                  `Squad member #${userPlayer.jerseyNumber} · ${userPlayer.position} for ${userPlayer.clubName}. Check match day schedule.`}
                {currentRole === 'admin' &&
                  'University platform administration. Sports catalog governance, role rules, and reset controls.'}
                {currentRole === 'viewer' &&
                  'Public tournament hub. Follow live matches, browse league tables, and explore varsity clubs.'}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {currentRole === 'organizer' && (
                <>
                  <button
                    onClick={() => setActiveTab('leagues')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create League</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('fixtures')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Score Matches</span>
                  </button>
                </>
              )}

              {currentRole === 'manager' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedClubId(userClub.id);
                      setActiveTab('club');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage Roster</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Club Store</span>
                  </button>
                </>
              )}

              {currentRole === 'player' && (
                <>
                  <button
                    onClick={() => setActiveTab('fixtures')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Matches</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('standings')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>League Table</span>
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                  >
                    <Shield className="w-4 h-4" />
                    <span>System Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leagues')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>All Tournaments</span>
                  </button>
                </>
              )}

              {currentRole === 'viewer' && (
                <>
                  <button
                    onClick={() => setActiveTab('fixtures')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Live Match Center</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('standings')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Standings</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('leagues')}
          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Leagues</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {activeLeaguesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            4 sanctioned sports
          </div>
        </div>

        <div
          onClick={() => setActiveTab('fixtures')}
          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live & Today</span>
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {liveMatches.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            Active in stadium
          </div>
        </div>

        <div
          onClick={() => setActiveTab('fixtures')}
          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {upcomingMatches.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Scheduled on calendar
          </div>
        </div>

        <div
          onClick={() => setActiveTab('club')}
          className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Clubs</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {registeredClubsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 5 universities
          </div>
        </div>
      </div>

      {/* Main Grid: Live Match Spotlight + Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Live Matches Spotlight */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Live & In-Progress Matches
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('fixtures')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Match Centre</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {liveMatches.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400 text-xs">
              No live matches currently in session. Check upcoming fixtures below.
            </div>
          ) : (
            liveMatches.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMatchId(m.id);
                  setActiveTab('fixtures');
                }}
                className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-950/20 hover:border-emerald-500/60 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px] tracking-wider">
                      LIVE
                    </span>
                    <span className="font-semibold text-white capitalize">{m.sport}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate max-w-[180px] sm:max-w-xs">{m.leagueName}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold text-[11px] bg-slate-800 px-2 py-0.5 rounded">
                    {m.period || 'In Progress'}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2 my-2">
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.homeClubName.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {m.homeClubName}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      {m.homeScore} - {m.awayScore}
                    </div>
                  </div>

                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <span className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {m.awayClubName}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.awayClubName.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Latest Event strip */}
                {m.events && m.events.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-400 font-mono font-semibold">
                        {m.events[m.events.length - 1].minuteOrOver}
                      </span>
                      <span className="text-white font-medium">
                        {m.events[m.events.length - 1].player}
                      </span>
                      <span className="text-slate-400">
                        ({m.events[m.events.length - 1].type})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 flex items-center gap-1 shrink-0 ml-2">
                      {currentRole === 'organizer' || currentRole === 'admin' ? 'Enter Score →' : 'View Match →'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Recent Completed Matches */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider font-mono">
              Recent Match Results
            </h3>
            <div className="space-y-2">
              {completedMatches.slice(0, 3).map((cm) => (
                <div
                  key={cm.id}
                  onClick={() => {
                    setSelectedMatchId(cm.id);
                    setActiveTab('fixtures');
                  }}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      FT
                    </span>
                    <div className="truncate text-xs font-medium text-slate-200">
                      <span className={cm.homeScore > cm.awayScore ? 'text-white font-bold' : 'text-slate-400'}>
                        {cm.homeClubName}
                      </span>
                      <span className="mx-2 text-slate-400 font-mono font-semibold">
                        {cm.homeScore} - {cm.awayScore}
                      </span>
                      <span className={cm.awayScore > cm.homeScore ? 'text-white font-bold' : 'text-slate-400'}>
                        {cm.awayClubName}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                    {cm.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Fixtures & Quick Navigation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Upcoming Schedule
            </h2>
            <button
              onClick={() => setActiveTab('fixtures')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingMatches.slice(0, 3).map((up) => (
              <div
                key={up.id}
                onClick={() => {
                  setSelectedMatchId(up.id);
                  setActiveTab('fixtures');
                }}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 capitalize">{up.sport}</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{up.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-white my-1">
                  <span className="truncate max-w-[120px] sm:max-w-[140px]">{up.homeClubName}</span>
                  <span className="text-xs text-slate-400 font-mono font-normal">vs</span>
                  <span className="truncate max-w-[120px] sm:max-w-[140px] text-right">{up.awayClubName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{up.venue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Hub Card: Active League Table Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Football Championship Standings
              </span>
              <button
                onClick={() => {
                  setSelectedLeagueId('lg-football-nascon');
                  setActiveTab('standings');
                }}
                className="text-xs text-emerald-400 hover:underline"
              >
                Full Table →
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-4 font-mono">1</span>
                  <span>Islamabad Strikers FC</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">6P</span>
                  <span className="text-white font-bold">13 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-4 font-mono text-slate-400">2</span>
                  <span>Karachi Titans</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">6P</span>
                  <span className="text-white font-bold">11 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-4 font-mono text-slate-400">3</span>
                  <span>Lahore Phoenix</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">6P</span>
                  <span className="text-white font-bold">10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
