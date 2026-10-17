import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  UserRole,
  Club,
  Player,
  League,
  MatchFixture,
  MatchEvent,
  StandingRow,
  Product,
  Order,
  CartItem,
  TransferRecord,
  NotificationItem,
  OfflineAction,
  SystemConfig,
  CricketDetails,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLUBS,
  INITIAL_PLAYERS,
  INITIAL_LEAGUES,
  INITIAL_MATCHES,
  INITIAL_PRODUCTS,
  INITIAL_TRANSFERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_CONFIG,
  DEMO_PASSWORD,
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => boolean;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  clubs: Club[];
  players: Player[];
  leagues: League[];
  matches: MatchFixture[];
  products: Product[];
  orders: Order[];
  transfers: TransferRecord[];
  notifications: NotificationItem[];
  systemConfig: SystemConfig;

  offlineMode: boolean;
  toggleOfflineMode: () => void;
  offlineQueue: OfflineAction[];
  syncPendingActions: () => void;

  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeagueId: string | null;
  setSelectedLeagueId: (id: string | null) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  selectedClubId: string | null;
  setSelectedClubId: (id: string | null) => void;

  isMobileFrameView: boolean;
  setIsMobileFrameView: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Actions
  createLeague: (data: Omit<League, 'id' | 'currentRound'>) => League;
  updateMatchScore: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: 'upcoming' | 'live' | 'completed',
    events?: MatchEvent[],
    cricketDetails?: CricketDetails
  ) => void;
  addMatchEvent: (matchId: string, event: Omit<MatchEvent, 'id'>) => void;
  addPlayer: (clubId: string, player: Omit<Player, 'id' | 'clubId' | 'clubName'>) => Player;
  transferPlayer: (
    playerId: string,
    toClubId: string,
    type: 'Transfer' | 'Loan' | 'Release',
    fee?: string
  ) => void;
  createOrder: (
    cartItems: CartItem[],
    customerName: string,
    customerEmail: string,
    paymentMethod: string
  ) => { success: boolean; orderId?: string };
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  resetDemoData: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  calculateStandings: (leagueId: string) => StandingRow[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load local state or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nascon_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default Organizer for immediate rich demo
  });

  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem('nascon_clubs');
    return saved ? JSON.parse(saved) : INITIAL_CLUBS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('nascon_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [leagues, setLeagues] = useState<League[]>(() => {
    const saved = localStorage.getItem('nascon_leagues');
    return saved ? JSON.parse(saved) : INITIAL_LEAGUES;
  });

  const [matches, setMatches] = useState<MatchFixture[]>(() => {
    const saved = localStorage.getItem('nascon_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nascon_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nascon_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [transfers, setTransfers] = useState<TransferRecord[]>(() => {
    const saved = localStorage.getItem('nascon_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('nascon_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('nascon_config');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_CONFIG;
  });

  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>('club-isb');
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nascon_clubs', JSON.stringify(clubs));
  }, [clubs]);
  useEffect(() => {
    localStorage.setItem('nascon_players', JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem('nascon_leagues', JSON.stringify(leagues));
  }, [leagues]);
  useEffect(() => {
    localStorage.setItem('nascon_matches', JSON.stringify(matches));
  }, [matches]);
  useEffect(() => {
    localStorage.setItem('nascon_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('nascon_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('nascon_transfers', JSON.stringify(transfers));
  }, [transfers]);
  useEffect(() => {
    localStorage.setItem('nascon_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('nascon_config', JSON.stringify(systemConfig));
  }, [systemConfig]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nascon_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nascon_user');
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: String(Date.now()), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      showToast('Account not found. Use one of the demo emails provided.', 'error');
      return false;
    }
    if (pass !== DEMO_PASSWORD) {
      showToast(`Invalid password. Demo password is "${DEMO_PASSWORD}"`, 'error');
      return false;
    }
    setCurrentUser(found);
    showToast(`Welcome back, ${found.name}! Signed in as ${found.role.toUpperCase()}`, 'success');
    return true;
  };

  const quickLogin = (role: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      setActiveTab('dashboard');
      showToast(`Switched account: ${found.name} (${found.role.toUpperCase()})`, 'info');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  const switchRole = (role: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Active role switched to: ${role.toUpperCase()}`, 'info');
    }
  };

  const toggleOfflineMode = () => {
    const next = !offlineMode;
    setOfflineMode(next);
    if (next) {
      showToast('Offline Mode Activated. Changes will be staged locally in queue.', 'info');
    } else {
      showToast('Reconnected to live network. You can synchronize staged updates.', 'info');
    }
  };

  const syncPendingActions = () => {
    if (offlineQueue.length === 0) {
      showToast('No actions pending in offline queue', 'info');
      return;
    }
    const count = offlineQueue.length;
    setOfflineQueue((prev) => prev.map((item) => ({ ...item, status: 'synced' as const })));
    setTimeout(() => {
      setOfflineQueue([]);
      showToast(`Successfully synchronized ${count} staged actions with central operations!`, 'success');
    }, 700);
  };

  const addOfflineRecord = (actionType: string, payloadDescription: string) => {
    if (offlineMode) {
      const record: OfflineAction = {
        id: `off-${Date.now()}`,
        actionType,
        payloadDescription,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: 'pending',
      };
      setOfflineQueue((prev) => [record, ...prev]);
    }
  };

  const createLeague = (data: Omit<League, 'id' | 'currentRound'>): League => {
    const id = `lg-${Date.now()}`;
    const newLeague: League = {
      ...data,
      id,
      currentRound: 1,
    };
    setLeagues((prev) => [newLeague, ...prev]);

    // Generate initial match fixtures for the teams if >= 2 teams
    if (data.teams.length >= 2) {
      const newMatches: MatchFixture[] = [];
      const teamClubs = clubs.filter((c) => data.teams.includes(c.id));

      if (teamClubs.length >= 2) {
        // Create 2 sample round-1 matches
        const home1 = teamClubs[0];
        const away1 = teamClubs[1];
        newMatches.push({
          id: `mat-${Date.now()}-1`,
          leagueId: id,
          leagueName: data.name,
          sport: data.sport,
          round: 1,
          homeClubId: home1.id,
          awayClubId: away1.id,
          homeClubName: home1.name,
          awayClubName: away1.name,
          homeScore: 0,
          awayScore: 0,
          status: 'upcoming',
          date: '2026-10-25',
          time: '18:00 PST',
          venue: `${home1.stadium}`,
          events: [],
        });

        if (teamClubs.length >= 4) {
          const home2 = teamClubs[2];
          const away2 = teamClubs[3];
          newMatches.push({
            id: `mat-${Date.now()}-2`,
            leagueId: id,
            leagueName: data.name,
            sport: data.sport,
            round: 1,
            homeClubId: home2.id,
            awayClubId: away2.id,
            homeClubName: home2.name,
            awayClubName: away2.name,
            homeScore: 0,
            awayScore: 0,
            status: 'upcoming',
            date: '2026-10-26',
            time: '19:30 PST',
            venue: `${home2.stadium}`,
            events: [],
          });
        }
        setMatches((prev) => [...newMatches, ...prev]);
      }
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New League Launched',
      message: `${data.name} (${data.format}) created with ${data.teams.length} participating clubs.`,
      timestamp: 'Just now',
      type: 'system',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addOfflineRecord('Create League', `League "${data.name}" format: ${data.format}`);
    showToast(`League "${data.name}" created successfully!`, 'success');
    return newLeague;
  };

  const updateMatchScore = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: 'upcoming' | 'live' | 'completed',
    events?: MatchEvent[],
    cricketDetails?: CricketDetails
  ) => {
    let updatedMatchTitle = '';
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          updatedMatchTitle = `${m.homeClubName} vs ${m.awayClubName}`;
          return {
            ...m,
            homeScore,
            awayScore,
            status,
            events: events ?? m.events,
            cricketDetails: cricketDetails ?? m.cricketDetails,
          };
        }
        return m;
      })
    );

    addOfflineRecord('Update Match Score', `${updatedMatchTitle}: ${homeScore} - ${awayScore} (${status})`);
    showToast(`Score updated for ${updatedMatchTitle} (${homeScore} - ${awayScore})`, 'success');
  };

  const addMatchEvent = (matchId: string, eventData: Omit<MatchEvent, 'id'>) => {
    const newEvent: MatchEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
    };

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          let nextHome = m.homeScore;
          let nextAway = m.awayScore;

          if (eventData.type === 'goal') {
            if (eventData.team === 'home') nextHome += 1;
            else nextAway += 1;
          } else if (eventData.type === 'points') {
            if (eventData.team === 'home') nextHome += 2;
            else nextAway += 2;
          }

          return {
            ...m,
            homeScore: nextHome,
            awayScore: nextAway,
            events: [...m.events, newEvent],
          };
        }
        return m;
      })
    );

    addOfflineRecord('Match Event Logged', `${eventData.minuteOrOver} ${eventData.type.toUpperCase()} by ${eventData.player}`);
    showToast(`Event added: ${eventData.minuteOrOver} ${eventData.type} by ${eventData.player}`, 'success');
  };

  const addPlayer = (clubId: string, playerData: Omit<Player, 'id' | 'clubId' | 'clubName'>): Player => {
    const club = clubs.find((c) => c.id === clubId);
    const newPlayer: Player = {
      ...playerData,
      id: `ply-${Date.now()}`,
      clubId,
      clubName: club ? club.name : 'Unassigned Club',
    };

    setPlayers((prev) => [newPlayer, ...prev]);

    // increment club roster count
    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, rosterCount: c.rosterCount + 1 } : c))
    );

    addOfflineRecord('Add Player', `Player ${newPlayer.name} added to ${newPlayer.clubName}`);
    showToast(`Player ${newPlayer.name} added to roster successfully!`, 'success');
    return newPlayer;
  };

  const transferPlayer = (
    playerId: string,
    toClubId: string,
    type: 'Transfer' | 'Loan' | 'Release',
    fee: string = '$0'
  ) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const fromClubName = player.clubName;
    const fromClubId = player.clubId;
    const toClub = clubs.find((c) => c.id === toClubId);
    const toClubName = toClub ? toClub.name : 'Free Agent Pool';

    // Update player
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          if (type === 'Release') {
            return {
              ...p,
              clubId: 'free-agent',
              clubName: 'Free Agent Pool',
              status: 'Bench',
            };
          } else if (type === 'Loan') {
            return {
              ...p,
              clubId: toClubId,
              clubName: toClubName,
              status: 'On Loan',
            };
          } else {
            return {
              ...p,
              clubId: toClubId,
              clubName: toClubName,
              status: 'Active',
            };
          }
        }
        return p;
      })
    );

    // Update roster count on clubs
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === fromClubId) {
          return { ...c, rosterCount: Math.max(0, c.rosterCount - 1) };
        }
        if (c.id === toClubId && type !== 'Release') {
          return { ...c, rosterCount: c.rosterCount + 1 };
        }
        return c;
      })
    );

    // Record transfer
    const newRecord: TransferRecord = {
      id: `tr-${Date.now()}`,
      playerId,
      playerName: player.name,
      type,
      fromClub: fromClubName,
      toClub: toClubName,
      date: new Date().toISOString().split('T')[0],
      fee: fee || (type === 'Loan' ? '$500 (Loan)' : '$2,500'),
      status: 'Completed',
    };
    setTransfers((prev) => [newRecord, ...prev]);

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${type} Completed: ${player.name}`,
      message: `${player.name} moved from ${fromClubName} to ${toClubName}.`,
      timestamp: 'Just now',
      type: 'transfer',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addOfflineRecord(`Player ${type}`, `${player.name}: ${fromClubName} -> ${toClubName}`);
    showToast(`${type} completed for ${player.name}!`, 'success');
  };

  const createOrder = (
    cartItems: CartItem[],
    customerName: string,
    customerEmail: string,
    paymentMethod: string
  ): { success: boolean; orderId?: string } => {
    // Reduce stock locally
    const productDeltas: Record<string, number> = {};
    cartItems.forEach((item) => {
      productDeltas[item.product.id] = (productDeltas[item.product.id] || 0) + item.quantity;
    });

    setProducts((prev) =>
      prev.map((p) => {
        if (productDeltas[p.id]) {
          return { ...p, stock: Math.max(0, p.stock - productDeltas[p.id]) };
        }
        return p;
      })
    );

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const orderId = `NSC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        size: ci.size,
      })),
      totalAmount,
      customerName,
      customerEmail,
      status: 'Confirmed',
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order ${orderId} Confirmed`,
      message: `Purchased ${cartItems.length} items ($${totalAmount}). Stock levels updated.`,
      timestamp: 'Just now',
      type: 'store',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addOfflineRecord('Store Checkout', `Order ${orderId} placed for $${totalAmount}`);
    showToast(`Order ${orderId} confirmed! Receipt generated.`, 'success');
    return { success: true, orderId };
  };

  const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Platform settings updated successfully', 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem('nascon_clubs');
    localStorage.removeItem('nascon_players');
    localStorage.removeItem('nascon_leagues');
    localStorage.removeItem('nascon_matches');
    localStorage.removeItem('nascon_products');
    localStorage.removeItem('nascon_orders');
    localStorage.removeItem('nascon_transfers');
    localStorage.removeItem('nascon_notifications');
    localStorage.removeItem('nascon_config');
    localStorage.removeItem('nascon_user');

    setClubs(INITIAL_CLUBS);
    setPlayers(INITIAL_PLAYERS);
    setLeagues(INITIAL_LEAGUES);
    setMatches(INITIAL_MATCHES);
    setProducts(INITIAL_PRODUCTS);
    setOrders([]);
    setTransfers(INITIAL_TRANSFERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSystemConfig(INITIAL_SYSTEM_CONFIG);
    setCurrentUser(INITIAL_USERS[1]); // Organizer
    setOfflineQueue([]);
    setOfflineMode(false);
    showToast('All demo records reset to initial tournament state', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Dynamic standings calculation
  const calculateStandings = (leagueId: string): StandingRow[] => {
    const targetLeague = leagues.find((l) => l.id === leagueId);
    if (!targetLeague) return [];

    const leagueTeams = clubs.filter((c) => targetLeague.teams.includes(c.id));
    const leagueMatches = matches.filter(
      (m) => m.leagueId === leagueId && m.status === 'completed'
    );

    const table: Record<string, StandingRow> = {};
    leagueTeams.forEach((c) => {
      table[c.id] = {
        clubId: c.id,
        clubName: c.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        form: [],
      };
    });

    leagueMatches.forEach((m) => {
      const home = table[m.homeClubId];
      const away = table[m.awayClubId];
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.won += 1;
        home.points += targetLeague.pointsPerWin;
        home.form.push('W');
        away.lost += 1;
        away.form.push('L');
      } else if (m.homeScore < m.awayScore) {
        away.won += 1;
        away.points += targetLeague.pointsPerWin;
        away.form.push('W');
        home.lost += 1;
        home.form.push('L');
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += targetLeague.pointsPerDraw;
        away.points += targetLeague.pointsPerDraw;
        home.form.push('D');
        away.form.push('D');
      }
      home.goalDiff = home.goalsFor - home.goalsAgainst;
      away.goalDiff = away.goalsFor - away.goalsAgainst;
    });

    return Object.values(table).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
  };

  const currentRole = currentUser?.role || 'viewer';
  const isLoggedIn = !!currentUser;

  const value = useMemo(
    () => ({
      currentUser,
      currentRole,
      isLoggedIn,
      login,
      quickLogin,
      logout,
      switchRole,
      clubs,
      players,
      leagues,
      matches,
      products,
      orders,
      transfers,
      notifications,
      systemConfig,
      offlineMode,
      toggleOfflineMode,
      offlineQueue,
      syncPendingActions,
      toast,
      showToast,
      clearToast,
      activeTab,
      setActiveTab,
      selectedLeagueId,
      setSelectedLeagueId,
      selectedMatchId,
      setSelectedMatchId,
      selectedClubId,
      setSelectedClubId,
      isMobileFrameView,
      setIsMobileFrameView,
      createLeague,
      updateMatchScore,
      addMatchEvent,
      addPlayer,
      transferPlayer,
      createOrder,
      updateSystemConfig,
      resetDemoData,
      markNotificationRead,
      markAllNotificationsRead,
      calculateStandings,
    }),
    [
      currentUser,
      currentRole,
      isLoggedIn,
      clubs,
      players,
      leagues,
      matches,
      products,
      orders,
      transfers,
      notifications,
      systemConfig,
      offlineMode,
      offlineQueue,
      toast,
      activeTab,
      selectedLeagueId,
      selectedMatchId,
      selectedClubId,
      isMobileFrameView,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
