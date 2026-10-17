import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SportType, TournamentFormat } from '../../types';
import {
  Trophy,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  Settings,
  Sparkles,
  HelpCircle,
  Shield,
} from 'lucide-react';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { clubs, createLeague, setActiveTab, setSelectedLeagueId } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState<SportType>('football');
  const [selectedTeams, setSelectedTeams] = useState<string[]>(['club-isb', 'club-lhr']);
  const [format, setFormat] = useState<TournamentFormat>('round-robin');
  const [season, setSeason] = useState('Fall 2026');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [pointsPerWin, setPointsPerWin] = useState(3);
  const [pointsPerDraw, setPointsPerDraw] = useState(1);
  const [totalRounds, setTotalRounds] = useState(4);
  const [isCreated, setIsCreated] = useState(false);
  const [createdLeagueId, setCreatedLeagueId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const sportOptions: { type: SportType; label: string; iconText: string; desc: string }[] = [
    { type: 'football', label: 'Football / Soccer', iconText: '⚽', desc: '11v11 university tournament' },
    { type: 'cricket', label: 'Cricket T20 / Tapeball', iconText: '🏏', desc: 'Over-limited white ball tournament' },
    { type: 'basketball', label: 'Basketball 5v5', iconText: '🏀', desc: 'FIBA collegiate court series' },
    { type: 'badminton', label: 'Badminton Varsity', iconText: '🏸', desc: 'Singles & Doubles flight open' },
  ];

  const formatOptions: {
    format: TournamentFormat;
    title: string;
    description: string;
    bestFor: string;
  }[] = [
    {
      format: 'round-robin',
      title: 'Round-Robin',
      description: 'Every team plays against every other team once or twice. Ranked on cumulative league points.',
      bestFor: 'Balanced regular seasons & championship groups',
    },
    {
      format: 'single-elimination',
      title: 'Single Elimination (Knockout)',
      description: 'One loss and a team is eliminated. Bracket halves shrink until the grand final champion.',
      bestFor: 'Fast-paced weekend cups & varsity knockout trophies',
    },
    {
      format: 'double-elimination',
      title: 'Double Elimination',
      description: 'Teams must lose twice to be eliminated. Divided into Winners and Consolation/Repêchage brackets.',
      bestFor: 'High-stakes championships where every team gets a 2nd chance',
    },
    {
      format: 'swiss',
      title: 'Swiss-System Tournament',
      description: 'Non-eliminating multi-round format where teams are matched against opponents with similar current win-loss records.',
      bestFor: 'Badminton, esports, and large team open qualifiers without knockouts',
    },
  ];

  const toggleTeam = (clubId: string) => {
    if (selectedTeams.includes(clubId)) {
      if (selectedTeams.length <= 2) {
        setErrorMsg('At least 2 teams are required to build tournament fixtures.');
        return;
      }
      setSelectedTeams((prev) => prev.filter((id) => id !== clubId));
    } else {
      setSelectedTeams((prev) => [...prev, clubId]);
      setErrorMsg('');
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter a league or tournament title.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (selectedTeams.length < 2) {
        setErrorMsg('Select at least 2 participating clubs.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      setStep(6);
    }
  };

  const handleCreate = () => {
    const created = createLeague({
      name,
      description: description || `${name} tournament sanctioned under NaSCon 2026 regulations.`,
      sport,
      format,
      season,
      status: 'Active',
      teamsCount: selectedTeams.length,
      teams: selectedTeams,
      startDate,
      endDate,
      pointsPerWin: Number(pointsPerWin),
      pointsPerDraw: Number(pointsPerDraw),
      totalRounds: Number(totalRounds),
    });

    setCreatedLeagueId(created.id);
    setIsCreated(true);
  };

  const handleFinishAndNavigate = (target: 'fixtures' | 'leagues' | 'standings') => {
    onClose();
    if (createdLeagueId) {
      setSelectedLeagueId(createdLeagueId);
    }
    setActiveTab(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New League</h2>
              <span className="text-[11px] text-slate-400">
                Organizer Multi-Step Tournament Wizard
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

        {/* Stepper Indicator */}
        {!isCreated && (
          <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Sport' },
              { num: 3, label: 'Teams' },
              { num: 4, label: 'Format' },
              { num: 5, label: 'Rules' },
              { num: 6, label: 'Review' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 ${
                  step === s.num
                    ? 'text-emerald-400 font-bold'
                    : step > s.num
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    step === s.num
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-200">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Confirmation View after creation */}
          {isCreated ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Tournament Created Successfully!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                <strong>{name}</strong> ({format}) has been sanctioned. Opening round fixtures have been generated and registered clubs have received schedule notices.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleFinishAndNavigate('fixtures')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  Open Fixtures & Enter Match Scores →
                </button>
                <button
                  onClick={() => handleFinishAndNavigate('standings')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  View League Standings Table
                </button>
                <button
                  onClick={() => handleFinishAndNavigate('leagues')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-800 transition-colors"
                >
                  Back to Leagues List
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Step 1: Tournament Title & Information
                    </h3>
                    <p className="text-xs text-slate-400">
                      Define the public title and season details for the competition.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      League / Tournament Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. NaSCon Inter-Varsity Futsal Cup 26"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tournament Edition / Season
                    </label>
                    <input
                      type="text"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      placeholder="Fall 2026"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Description & Regulations Summary
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter eligibility rules, venue guidelines, and university accreditation notes..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Sport */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Step 2: Choose Sport Category
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select sport to configure official scoring mechanics and event presets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sportOptions.map((s) => (
                      <div
                        key={s.type}
                        onClick={() => setSport(s.type)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          sport === s.type
                            ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{s.iconText}</span>
                        <div>
                          <div className="font-bold text-sm text-white">{s.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Participating Clubs */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        Step 3: Participating Clubs & Teams
                      </h3>
                      <p className="text-xs text-slate-400">
                        Select which clubs are entered into the draw ({selectedTeams.length} selected).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {clubs.map((c) => {
                      const isChecked = selectedTeams.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => toggleTeam(c.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-slate-800 border-emerald-500/80 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                              style={{ backgroundColor: `${c.primaryColor}25`, color: c.primaryColor }}
                            >
                              {c.code}
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-semibold text-white truncate">
                                {c.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {c.city} · {c.sport}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                              isChecked ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                            }`}
                          >
                            {isChecked && '✓'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Tournament Format */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Step 4: Select Tournament Format
                    </h3>
                    <p className="text-xs text-slate-400">
                      Determine how fixtures are structured and standings are scored.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {formatOptions.map((f) => (
                      <div
                        key={f.format}
                        onClick={() => setFormat(f.format)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          format === f.format
                            ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">{f.title}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                            {f.bestFor}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Rules & Scheduling */}
              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Step 5: Tournament Rules & Dates
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure scoring allocations and tournament schedule windows.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Points for a Win
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={pointsPerWin}
                        onChange={(e) => setPointsPerWin(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Points for a Draw
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="3"
                        value={pointsPerDraw}
                        onChange={(e) => setPointsPerDraw(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tournament Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Championship Final Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Total Scheduled Rounds
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={totalRounds}
                      onChange={(e) => setTotalRounds(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Review & Create */}
              {step === 6 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Step 6: Review Tournament Specifications
                    </h3>
                    <p className="text-xs text-slate-400">
                      Verify settings before sanctioning this tournament.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">League Title:</span>
                      <span className="font-bold text-white">{name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Sport:</span>
                      <span className="font-semibold text-white capitalize">{sport}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Tournament Format:</span>
                      <span className="font-semibold text-emerald-400 capitalize">{format}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Participating Teams:</span>
                      <span className="font-semibold text-white">{selectedTeams.length} Clubs</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Scoring Rules:</span>
                      <span className="font-mono text-slate-200">
                        {pointsPerWin} pts win · {pointsPerDraw} pts draw
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Schedule Window:</span>
                      <span className="font-mono text-slate-200">
                        {startDate} to {endDate}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isCreated && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sanction & Launch League</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
