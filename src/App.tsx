import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/auth/LoginView';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeaguesView } from './components/leagues/LeaguesView';
import { FixturesView } from './components/fixtures/FixturesView';
import { StandingsView } from './components/standings/StandingsView';
import { ClubRosterView } from './components/club/ClubRosterView';
import { StoreView } from './components/store/StoreView';
import { OfflineSyncView } from './components/sync/OfflineSyncView';
import { ProfileView } from './components/profile/ProfileView';
import { Smartphone, Monitor } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isLoggedIn, activeTab, isMobileFrameView, setIsMobileFrameView } = useApp();

  if (!isLoggedIn) {
    return (
      <>
        <LoginView />
        <Toast />
      </>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leagues':
        return <LeaguesView />;
      case 'fixtures':
        return <FixturesView />;
      case 'standings':
        return <StandingsView />;
      case 'club':
        return <ClubRosterView />;
      case 'store':
        return <StoreView />;
      case 'sync':
        return <OfflineSyncView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header />

      {/* Simulated Mobile Device Frame Mode vs Full Responsive View */}
      {isMobileFrameView ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950/80">
          <div className="mb-4 text-center">
            <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Flutter Mobile Device Simulation Mode
            </span>
            <div className="text-xs text-slate-400 mt-1">
              Optimized for smartphone thumb navigation (390px × 844px). Switch back using the top bar.
            </div>
          </div>

          {/* Smartphone Frame Outer Bezel */}
          <div className="w-full max-w-[400px] h-[820px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700/50">
            {/* Phone Notch / Speaker Island */}
            <div className="h-6 w-full bg-slate-900 flex items-center justify-between px-6 pt-1 text-[10px] text-slate-400 font-mono shrink-0 select-none z-30">
              <span>9:41</span>
              <div className="w-20 h-3.5 bg-black rounded-full mx-auto" />
              <span>5G · 100%</span>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20 relative bg-[#070D1E]">
              {renderActiveScreen()}
            </div>

            {/* Fixed Mobile Bottom Tab Bar inside Frame */}
            <BottomNav />
          </div>
        </div>
      ) : (
        /* Full Responsive Web Layout */
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 min-w-0 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {renderActiveScreen()}
          </main>
          {/* Mobile Bottom Bar when not in simulated frame but viewed on phone screens */}
          <BottomNav />
        </div>
      )}

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
