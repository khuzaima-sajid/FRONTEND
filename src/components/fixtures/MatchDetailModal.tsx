import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchFixture, MatchEvent, SportType } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Flame,
  Shield,
  Activity,
} from 'lucide-react';

interface MatchDetailModalProps {
  match: MatchFixture | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
}) => {
  const {
    currentRole,
    updateMatchScore,
    addMatchEvent,
    players,
    calculateStandings,
    offlineMode,
  } = useApp();

  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [status, setStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [period, setPeriod] = useState<string>('');

  // Event logger state
  const [eventType, setEventType] = useState<
    'goal' | 'wicket' | 'points' | 'foul' | 'yellow_card' | 'red_card' | 'substitution'
  >('goal');
  const [eventTeam, setEventTeam] = useState<'home' | 'away'>('home');
  const [eventPlayer, setEventPlayer] = useState<string>('');
  const [eventMinute, setEventMinute] = useState<string>("78'");
  const [eventNote, setEventNote] = useState<string>('');

  useEffect(() => {
    if (match) {
      setHomeScore(match.homeScore);
      setAwayScore(match.awayScore);
      setStatus(match.status);
      setPeriod(match.period || '');

      // Set default player from home team
      const homePlayers = players.filter((p) => p.clubId === match.homeClubId);
      if (homePlayers.length > 0) {
        setEventPlayer(homePlayers[0].name);
      } else {
        setEventPlayer('Striker #9');
      }

      // Default minute
      if (match.sport === 'football') {
        setEventType('goal');
        setEventMinute("75'");
      } else if (match.sport === 'cricket') {
        setEventType('wicket');
        setEventMinute('14.2 ov');
      } else if (match.sport === 'basketball') {
        setEventType('points');
        setEventMinute('Q3 03:15');
      }
    }
  }, [match, players]);

  if (!isOpen || !match) return null;

  const canEditScore = currentRole === 'organizer' || currentRole === 'admin';

  const relevantPlayers = players.filter(
    (p) => p.clubId === (eventTeam === 'home' ? match.homeClubId : match.awayClubId)
  );

  const handleSaveScore = () => {
    updateMatchScore(match.id, homeScore, awayScore, status, match.events, match.cricketDetails);
    // Standings automatically update in context
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventPlayer) return;

    addMatchEvent(match.id, {
      minuteOrOver: eventMinute,
      type: eventType,
      team: eventTeam,
      player: eventPlayer,
      note: eventNote || undefined,
    });

    // Also adjust local score input state
    if (eventType === 'goal') {
      if (eventTeam === 'home') setHomeScore((prev) => prev + 1);
      else setAwayScore((prev) => prev + 1);
    } else if (eventType === 'points') {
      if (eventTeam === 'home') setHomeScore((prev) => prev + 2);
      else setAwayScore((prev) => prev + 2);
    }

    setEventNote('');
  };

  const handleMarkCompleted = () => {
    setStatus('completed');
    setPeriod('Full Time');
    updateMatchScore(match.id, homeScore, awayScore, 'completed', match.events, match.cricketDetails);
  };

  const handleMarkLive = () => {
    setStatus('live');
    setPeriod("45' In Progress");
    updateMatchScore(match.id, homeScore, awayScore, 'live', match.events, match.cricketDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                {match.sport} · Round {match.round}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                  status === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : status === 'completed'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {status}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {match.leagueName}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close match dialog"
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-300">
          {/* Main Scoreboard Display */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-inner">
            <div className="grid grid-cols-12 items-center gap-3">
              {/* Home Team */}
              <div className="col-span-5 text-center sm:text-left flex flex-col sm:flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {match.homeClubName.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                    {match.homeClubName}
                  </h3>
                  <span className="text-[10px] text-slate-400">Home Squad</span>
                </div>
              </div>

              {/* Score Center */}
              <div className="col-span-2 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums bg-slate-950 border border-slate-800 py-1.5 px-3 rounded-xl shadow-md">
                  {homeScore} - {awayScore}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-1">
                  {period || (status === 'completed' ? 'FT' : match.time)}
                </div>
              </div>

              {/* Away Team */}
              <div className="col-span-5 text-center sm:text-right flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                    {match.awayClubName}
                  </h3>
                  <span className="text-[10px] text-slate-400">Away Squad</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {match.awayClubName.substring(0, 3).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Match Venue and Time info */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{match.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{match.date} · {match.time}</span>
              </div>
            </div>
          </div>

          {/* Organizer / Admin Scoring Control Panel */}
          {canEditScore && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Official Scoring & Match Control
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                  Organizer Access
                </span>
              </div>

              {/* Quick Score Adjuster Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-semibold text-slate-300 truncate">
                    {match.homeClubName} Score
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHomeScore((s) => Math.max(0, s - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold font-mono text-white w-8">
                      {homeScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHomeScore((s) => s + 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-semibold text-slate-300 truncate">
                    {match.awayClubName} Score
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAwayScore((s) => Math.max(0, s - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold font-mono text-white w-8">
                      {awayScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAwayScore((s) => s + 1)}
                      className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-slate-950 font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Save Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  {status !== 'live' && (
                    <button
                      type="button"
                      onClick={handleMarkLive}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs"
                    >
                      Set Match Live
                    </button>
                  )}
                  {status !== 'completed' && (
                    <button
                      type="button"
                      onClick={handleMarkCompleted}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs"
                    >
                      Mark Completed (FT)
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveScore}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  Save Score & Update Table
                </button>
              </div>

              {/* Add Match Event Form */}
              <form onSubmit={handleAddEvent} className="pt-3 border-t border-slate-800 space-y-3">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Log Match Incident / Key Event
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Incident Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                    >
                      <option value="goal">Goal (Football)</option>
                      <option value="points">Points / Basket</option>
                      <option value="wicket">Wicket (Cricket)</option>
                      <option value="yellow_card">Yellow Card</option>
                      <option value="red_card">Red Card</option>
                      <option value="foul">Foul</option>
                      <option value="substitution">Substitution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Squad Side</label>
                    <select
                      value={eventTeam}
                      onChange={(e) => setEventTeam(e.target.value as 'home' | 'away')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                    >
                      <option value="home">Home ({match.homeClubName.substring(0, 12)})</option>
                      <option value="away">Away ({match.awayClubName.substring(0, 12)})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Player</label>
                    <input
                      type="text"
                      value={eventPlayer}
                      onChange={(e) => setEventPlayer(e.target.value)}
                      placeholder="Player Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Minute / Over</label>
                    <input
                      type="text"
                      value={eventMinute}
                      onChange={(e) => setEventMinute(e.target.value)}
                      placeholder="e.g. 78'"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={eventNote}
                    onChange={(e) => setEventNote(e.target.value)}
                    placeholder="Optional incident note (e.g. Penalty, Header, Catch by deep fielder)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs whitespace-nowrap"
                  >
                    + Add Event
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Match Events Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
              Match Timeline & Events ({match.events.length})
            </h4>

            {match.events.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-slate-500 text-xs">
                No key incidents logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {match.events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      ev.team === 'home'
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/60 border-slate-800 sm:flex-row-reverse'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {ev.minuteOrOver}
                      </span>
                      <span className="font-semibold text-white">{ev.player}</span>
                      <span className="text-[10px] uppercase font-mono text-slate-400 px-1.5 py-0.5 bg-slate-800/80 rounded">
                        {ev.type}
                      </span>
                    </div>

                    {ev.note && (
                      <span className="text-[11px] text-slate-400 italic truncate max-w-xs">
                        "{ev.note}"
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {offlineMode ? 'Changes staged in offline cache' : 'Central operations synced'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Match Center
          </button>
        </div>
      </div>
    </div>
  );
};
