import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_PASSWORD } from '../../data/mockData';
import {
  Trophy,
  Shield,
  Calendar,
  Users,
  Eye,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, quickLogin } = useApp();

  const [email, setEmail] = useState('organizer@nascon.test');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [selectedRole, setSelectedRole] = useState<UserRole>('organizer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts: {
    role: UserRole;
    name: string;
    email: string;
    desc: string;
    icon: typeof Trophy;
  }[] = [
    {
      role: 'organizer',
      name: 'Sarah Malik',
      email: 'organizer@nascon.test',
      desc: 'Create leagues, generate fixtures, enter match scores',
      icon: Calendar,
    },
    {
      role: 'manager',
      name: 'Kamran Akram',
      email: 'manager@nascon.test',
      desc: 'Manage Strikers FC roster, player transfers, club merchandise',
      icon: Users,
    },
    {
      role: 'player',
      name: 'Zayn Arshad',
      email: 'player@nascon.test',
      desc: 'Player #10 profile, match calendar, career transfers',
      icon: Trophy,
    },
    {
      role: 'admin',
      name: 'Dr. Tariq Rafiq',
      email: 'admin@nascon.test',
      desc: 'Platform governance, sports configuration, system resets',
      icon: Shield,
    },
    {
      role: 'viewer',
      name: 'Hamza Bilal',
      email: 'viewer@nascon.test',
      desc: 'Public fan mode: browse leagues, live scores, standings',
      icon: Eye,
    },
  ];

  const handleSelectRole = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(DEMO_PASSWORD);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter the password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      setIsLoading(false);
      if (!ok) {
        setErrorMsg(`Authentication failed. Use password "${DEMO_PASSWORD}".`);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>NaSCon 26 Official Prototype</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Multi-Sport League & Club{' '}
            <span className="text-emerald-400">Operations</span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A unified operations suite for collegiate tournament administration, live scoring, roster transfers, team stores, and offline-resilient field operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 1-Click Quick Role Switcher Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Select Demo Persona (1-Click Access)
                </h2>
                <span className="text-xs text-emerald-400 font-medium">
                  Password: {DEMO_PASSWORD}
                </span>
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedRole === acc.role;
                  return (
                    <div
                      key={acc.role}
                      onClick={() => handleSelectRole(acc)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/40 translate-x-1'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {acc.name}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {acc.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {acc.desc}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickLogin(acc.role);
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                      >
                        <span>Launch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* University Evaluation Note */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Evaluator Note:</strong> State persists in your browser storage. You can freely switch personas anytime from the top bar to inspect each user journey.
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Sign In to Workspace</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Use chosen persona credentials or sign in manually.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Demo Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. organizer@nascon.test"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Demo Password
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Nascon@26
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nascon@26"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-emerald-950/50 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin mr-1">↻</span>
                  ) : (
                    <>
                      <span>Enter Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                FAST National University · NaSCon 2026 Sports Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
