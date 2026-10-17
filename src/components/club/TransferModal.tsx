import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Player } from '../../types';
import { ArrowRightLeft, X, AlertTriangle, Check } from 'lucide-react';

interface TransferModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  const { clubs, transferPlayer } = useApp();

  const [transferType, setTransferType] = useState<'Transfer' | 'Loan' | 'Release'>('Transfer');
  const [targetClubId, setTargetClubId] = useState<string>('club-lhr');
  const [fee, setFee] = useState<string>('$3,500');

  if (!isOpen || !player) return null;

  const eligibleClubs = clubs.filter((c) => c.id !== player.clubId);

  const handleConfirm = () => {
    transferPlayer(player.id, targetClubId, transferType, fee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Roster Transaction</h2>
              <span className="text-[11px] text-slate-400">
                Action for {player.name} (#{player.jerseyNumber})
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
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Select Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Transfer', 'Loan', 'Release'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransferType(t)}
                  className={`py-2 px-3 rounded-xl font-semibold border text-center transition-all ${
                    transferType === t
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {transferType !== 'Release' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Destination Club
              </label>
              <select
                value={targetClubId}
                onChange={(e) => setTargetClubId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {eligibleClubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {transferType !== 'Release' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Collegiate Transfer / Loan Fee
              </label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. $2,500"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-slate-400">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {transferType === 'Transfer' &&
                `This action will permanently move ${player.name} from ${player.clubName} to the destination club roster and decrement current squad cap.`}
              {transferType === 'Loan' &&
                `This action will stage a temporary seasonal loan agreement for ${player.name}.`}
              {transferType === 'Release' &&
                `This action will release ${player.name} into the NaSCon Free Agent pool.`}
            </span>
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
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm {transferType}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
