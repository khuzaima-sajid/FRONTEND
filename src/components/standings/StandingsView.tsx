import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Trophy,
  ChevronDown,
  Info,
  Calendar,
  Shield,
  Medal,
} from 'lucide-react';

export const StandingsView: React.FC = () => {
  const { leagues, clubs, calculateStandings, selectedLeagueId, setSelectedLeagueId, setActiveTab } =
    useApp();

  const [activeLeagueId, setActiveLeagueId] = useState<string>(
    selectedLeagueId || leagues[0]?.id || 'lg-football-nascon'
  );

  const currentLeague =
    leagues.find((l) => l.id === activeLeagueId) || leagues[0];

  const standings = calculateStandings(currentLeague?.id || '');

  return (
    <div className="space-y-6 pb-12">
      {/* Title & League Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            League Standings & Tables
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time standings dynamically calculated from recorded match scores.
          </p>
        </div>

        {/* League Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">
            Select Competition:
          </label>
          <div className="relative">
            <select
              value={activeLeagueId}
              onChange={(e) => {
                setActiveLeagueId(e.target.value);
                setSelectedLeagueId(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 pr-8"
            >
              {leagues.map((lg) => (
                <option key={lg.id} value={lg.id}>
                  {lg.name} ({lg.sport})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* League Banner info */}
      {currentLeague && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {currentLeague.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  {currentLeague.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="capitalize">{currentLeague.sport}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{currentLeague.format} format</span>
                <span aria-hidden="true">·</span>
                <span>{currentLeague.season}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedLeagueId(currentLeague.id);
                setActiveTab('fixtures');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Fixtures</span>
            </button>
          </div>
        </div>
      )}

      {/* Standings Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/70">
                <th className="py-3 px-4 w-12 text-center">Pos</th>
                <th className="py-3 px-4">Club</th>
                <th className="py-3 px-3 text-center">P</th>
                <th className="py-3 px-3 text-center">W</th>
                <th className="py-3 px-3 text-center">D</th>
                <th className="py-3 px-3 text-center">L</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">GF</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">GA</th>
                <th className="py-3 px-3 text-center">GD</th>
                <th className="py-3 px-4 text-center font-bold text-white">Pts</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {standings.map((row, idx) => {
                const rank = idx + 1;
                const isChampionZone = rank <= 2;
                const isRelegationZone = rank > standings.length - 2 && standings.length > 3;

                return (
                  <tr
                    key={row.clubId}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isChampionZone ? 'bg-emerald-500/[0.03]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <div className="flex items-center justify-center gap-1">
                        {rank === 1 && (
                          <Medal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span
                          className={
                            isChampionZone
                              ? 'text-emerald-400'
                              : isRelegationZone
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }
                        >
                          {rank}
                        </span>
                      </div>
                    </td>

                    {/* Club */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {row.clubName.substring(0, 3).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[160px] sm:max-w-xs">{row.clubName}</span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {row.played}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {row.won}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-400">
                      {row.drawn}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-400">
                      {row.lost}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                      {row.goalsFor}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                      {row.goalsAgainst}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums font-semibold">
                      <span
                        className={
                          row.goalDiff > 0
                            ? 'text-emerald-400'
                            : row.goalDiff < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sm text-white bg-slate-950/40">
                      {row.points}
                    </td>

                    {/* Form Guide */}
                    <td className="py-3.5 px-4 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                        {row.form.length === 0 ? (
                          <span className="text-slate-600">-</span>
                        ) : (
                          row.form.slice(-5).map((f, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded flex items-center justify-center font-bold ${
                                f === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : f === 'D'
                                  ? 'bg-slate-700 text-slate-300'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {f}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Championship Playoffs / Seed 1-2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Relegation / Consolation Zone</span>
            </div>
          </div>
          <span className="text-slate-500 font-mono">
            Rules: {currentLeague?.pointsPerWin} pts win · {currentLeague?.pointsPerDraw} pts draw
          </span>
        </div>
      </div>
    </div>
  );
};
