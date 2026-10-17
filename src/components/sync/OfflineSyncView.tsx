import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfflineAction } from '../../types';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Database,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const OfflineSyncView: React.FC = () => {
  const {
    offlineMode,
    toggleOfflineMode,
    offlineQueue,
    syncPendingActions,
    notifications,
    markNotificationRead,
    showToast,
  } = useApp();

  const [simulatedConflictItem, setSimulatedConflictItem] = useState<OfflineAction | null>(null);

  const pendingCount = offlineQueue.filter((a) => a.status === 'pending').length;

  const handleInjectSampleOfflineAction = (type: string) => {
    if (!offlineMode) {
      showToast('Activate Offline Mode first to stage offline transactions.', 'info');
      toggleOfflineMode();
    }
  };

  const handleSimulateConflict = () => {
    const conflict: OfflineAction = {
      id: `conf-${Date.now()}`,
      actionType: 'Score Submission Collision',
      payloadDescription: 'Pitch Official #2 submitted 2 - 1 while Pitch Official #1 submitted 2 - 2 at 78th minute.',
      timestamp: new Date().toLocaleTimeString(),
      status: 'conflict',
    };
    setSimulatedConflictItem(conflict);
    showToast('Simulated a multi-official score conflict for evaluation testing.', 'info');
  };

  const handleResolveConflict = (strategy: 'local' | 'server') => {
    showToast(
      strategy === 'local'
        ? 'Conflict resolved: Local pitch report authoritative timestamp accepted.'
        : 'Conflict resolved: Reverted to central scorekeeper log.',
      'success'
    );
    setSimulatedConflictItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Field Operations & Offline Synchronization
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Demonstrating Flutter / PWA local-first architecture for outdoor stadiums with intermittent network connectivity.
          </p>
        </div>

        {/* Network Toggle Button */}
        <button
          onClick={toggleOfflineMode}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border shadow-lg transition-transform active:scale-95 ${
            offlineMode
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-amber-950/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-emerald-950/40'
          }`}
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>Simulating Offline Pitch (Click to Reconnect)</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Live Network Active (Click to Go Offline)</span>
            </>
          )}
        </button>
      </div>

      {/* Sync Status Banner */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          offlineMode
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                offlineMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {offlineMode ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {offlineMode ? 'Local Device Cache Active' : 'Connected to Central NaSCon Cloud'}
                </h3>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    offlineMode
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {offlineMode ? 'OFFLINE STAGING' : 'HEALTHY'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {offlineMode
                  ? 'All match scores, roster transfers, and tournament edits are safely staged in the local device queue.'
                  : 'All client actions are automatically committed to the tournament event stream in real time.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {offlineQueue.length > 0 && (
              <button
                onClick={syncPendingActions}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Staged Actions ({pendingCount})</span>
              </button>
            )}
            <button
              onClick={handleSimulateConflict}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Simulate Conflict
            </button>
          </div>
        </div>
      </div>

      {/* Conflict Resolution Drawer / Banner if triggered */}
      {simulatedConflictItem && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Demonstration: Field Sync Conflict Detected</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {simulatedConflictItem.payloadDescription}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="font-semibold text-white">Choose Resolution Strategy:</span>
            <button
              onClick={() => handleResolveConflict('local')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            >
              Accept Local Pitch Official Score
            </button>
            <button
              onClick={() => handleResolveConflict('server')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700"
            >
              Revert to Central Cloud Log
            </button>
          </div>
        </div>
      )}

      {/* Offline Action Queue List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Local Event Queue ({offlineQueue.length} items)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {pendingCount} Pending · {offlineQueue.length - pendingCount} Synced
          </span>
        </div>

        {offlineQueue.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">Offline queue is currently empty</h4>
            <p className="mt-1">
              Toggle "Offline Mode" at the top and update any match score or store item to see actions stage here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {offlineQueue.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  item.status === 'pending'
                    ? 'bg-slate-900/90 border-amber-500/40 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      item.status === 'pending'
                        ? 'bg-amber-400 animate-pulse'
                        : item.status === 'synced'
                        ? 'bg-emerald-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.actionType}</span>
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                          item.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-0.5">
                      {item.payloadDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Central Notifications List */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h3 className="text-base font-bold text-white">Central Operations Notification Feed</h3>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{n.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {n.type}
                  </span>
                </div>
                <p className="text-slate-300 mt-1">{n.message}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-mono shrink-0">
                {n.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
