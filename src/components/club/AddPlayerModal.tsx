import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SportType } from '../../types';
import { UserPlus, X, Check } from 'lucide-react';

interface AddPlayerModalProps {
  clubId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  clubId,
  isOpen,
  onClose,
}) => {
  const { clubs, addPlayer } = useApp();

  const club = clubs.find((c) => c.id === clubId);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [jerseyNumber, setJerseyNumber] = useState<number>(14);
  const [status, setStatus] = useState<'Active' | 'Bench' | 'Injured' | 'On Loan'>('Active');
  const [age, setAge] = useState<number>(20);
  const [nationality, setNationality] = useState('Pakistan');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !club) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter player name.');
      return;
    }

    addPlayer(clubId, {
      name: name.trim(),
      position,
      jerseyNumber: Number(jerseyNumber),
      status,
      sport: club.sport,
      age: Number(age),
      nationality,
      appearances: 0,
      goalsOrPoints: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Player to Squad</h2>
              <span className="text-[11px] text-slate-400">
                Registering for {club.name}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shaheen Shah"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Squad Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Center Forward"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Jersey #
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Active">Active Squad</option>
                <option value="Bench">Bench Reserve</option>
                <option value="Injured">Injured</option>
                <option value="On Loan">On Loan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Age
              </label>
              <input
                type="number"
                min="16"
                max="35"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Register Player</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
