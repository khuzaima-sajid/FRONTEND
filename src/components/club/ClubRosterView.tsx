import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Player, Club } from '../../types';
import { AddPlayerModal } from './AddPlayerModal';
import { TransferModal } from './TransferModal';
import {
  Users,
  UserPlus,
  ArrowRightLeft,
  MapPin,
  Building,
  Trophy,
  DollarSign,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ClubRosterView: React.FC = () => {
  const {
    clubs,
    players,
    transfers,
    currentRole,
    currentUser,
    selectedClubId,
    setSelectedClubId,
  } = useApp();

  const activeClubId =
    selectedClubId || currentUser?.clubId || clubs[0].id;

  const currentClub =
    clubs.find((c) => c.id === activeClubId) || clubs[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [selectedPlayerForTransfer, setSelectedPlayerForTransfer] = useState<Player | null>(null);

  const clubPlayers = players.filter((p) => p.clubId === currentClub.id);

  const filteredPlayers = clubPlayers.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.jerseyNumber).includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const canManageRoster =
    currentRole === 'admin' ||
    (currentRole === 'manager' && (!currentUser?.clubId || currentUser.clubId === currentClub.id));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Club Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Club Profile & Roster Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official collegiate franchise roster, squad status, and inter-club transfer records.
          </p>
        </div>

        {/* Club Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">
            Franchise:
          </label>
          <select
            value={currentClub.id}
            onChange={(e) => setSelectedClubId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Club Profile Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border"
              style={{
                backgroundColor: `${currentClub.primaryColor}20`,
                borderColor: `${currentClub.primaryColor}50`,
                color: currentClub.primaryColor,
              }}
            >
              {currentClub.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentClub.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                  {currentClub.sport}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Manager: <strong className="text-white">{currentClub.managerName}</strong></span>
                <span aria-hidden="true">·</span>
                <span>City: <strong className="text-white">{currentClub.city}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Est. {currentClub.founded}</span>
              </div>
            </div>
          </div>

          {canManageRoster && (
            <button
              onClick={() => setIsAddPlayerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Player</span>
            </button>
          )}
        </div>

        {/* Club Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase text-slate-400">Home Ground</span>
            <div className="text-xs font-semibold text-white mt-1 truncate">
              {currentClub.stadium}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase text-slate-400">Roster Count</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              {clubPlayers.length} Active Players
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase text-slate-400">Operating Budget</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {currentClub.budget}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase text-slate-400">Season Record</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              {currentClub.wins}W - {currentClub.draws}D - {currentClub.losses}L
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Squad Roster</h3>
            <span className="text-xs text-slate-400 font-mono">({filteredPlayers.length} listed)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              {(['all', 'Active', 'Bench', 'On Loan'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search squad..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Players List Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/70">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-3 text-center">Age</th>
                  <th className="py-3 px-3 text-center">Apps</th>
                  <th className="py-3 px-3 text-center">Goals / Pts</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {canManageRoster && (
                    <th className="py-3 px-4 text-right">Transaction</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No players found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                        {player.jerseyNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{player.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({player.nationality})
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {player.position}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                        {player.age}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                        {player.appearances}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                        {player.goalsOrPoints}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                            player.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : player.status === 'On Loan'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {player.status}
                        </span>
                      </td>

                      {canManageRoster && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedPlayerForTransfer(player)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                            <span>Transfer / Loan</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transfer History Log Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-white">Inter-Club Transfer History</h3>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          {transfers.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No transactions recorded this season yet.
            </div>
          ) : (
            transfers.map((tr) => (
              <div
                key={tr.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      tr.type === 'Transfer'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : tr.type === 'Loan'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {tr.type}
                  </span>
                  <span className="font-bold text-white">{tr.playerName}</span>
                  <span className="text-slate-400">
                    {tr.fromClub} → <strong className="text-slate-200">{tr.toClub}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>Fee: {tr.fee || 'N/A'}</span>
                  <span>{tr.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPlayerModal
        clubId={currentClub.id}
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
      />

      <TransferModal
        player={selectedPlayerForTransfer}
        isOpen={!!selectedPlayerForTransfer}
        onClose={() => setSelectedPlayerForTransfer(null)}
      />
    </div>
  );
};
