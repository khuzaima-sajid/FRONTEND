export type UserRole = 'admin' | 'organizer' | 'manager' | 'player' | 'viewer';

export type SportType = 'football' | 'cricket' | 'basketball' | 'badminton';

export type TournamentFormat = 'round-robin' | 'swiss' | 'single-elimination' | 'double-elimination';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clubId?: string;
  clubName?: string;
  jerseyNumber?: number;
  position?: string;
  avatar?: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  code: string;
  sport: SportType;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  managerName: string;
  stadium: string;
  city: string;
  founded: number;
  budget: string;
  rosterCount: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Player {
  id: string;
  name: string;
  clubId: string;
  clubName: string;
  position: string;
  jerseyNumber: number;
  status: 'Active' | 'Bench' | 'Injured' | 'On Loan';
  sport: SportType;
  age: number;
  nationality: string;
  appearances: number;
  goalsOrPoints: number;
  yellowCards?: number;
}

export interface TransferRecord {
  id: string;
  playerId: string;
  playerName: string;
  type: 'Transfer' | 'Loan' | 'Release';
  fromClub: string;
  toClub: string;
  date: string;
  fee?: string;
  status: 'Completed' | 'Pending';
}

export interface League {
  id: string;
  name: string;
  sport: SportType;
  format: TournamentFormat;
  season: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  teamsCount: number;
  teams: string[]; // Club IDs
  startDate: string;
  endDate: string;
  description: string;
  pointsPerWin: number;
  pointsPerDraw: number;
  currentRound: number;
  totalRounds: number;
}

export interface MatchEvent {
  id: string;
  minuteOrOver: string;
  type: 'goal' | 'wicket' | 'points' | 'foul' | 'yellow_card' | 'red_card' | 'substitution';
  team: 'home' | 'away';
  player: string;
  note?: string;
}

export interface CricketDetails {
  homeOvers: string;
  homeWickets: number;
  awayOvers: string;
  awayWickets: number;
}

export interface MatchFixture {
  id: string;
  leagueId: string;
  leagueName: string;
  sport: SportType;
  round: string | number;
  homeClubId: string;
  awayClubId: string;
  homeClubName: string;
  awayClubName: string;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'completed';
  date: string;
  time: string;
  venue: string;
  events: MatchEvent[];
  period?: string;
  cricketDetails?: CricketDetails;
}

export interface StandingRow {
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Product {
  id: string;
  name: string;
  clubId: string;
  clubName: string;
  category: 'Apparel' | 'Headwear' | 'Equipment' | 'Accessories';
  price: number;
  stock: number;
  sizes: string[];
  image: string;
  badge?: string;
  description: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  status: 'Confirmed' | 'Dispatched' | 'Delivered';
  date: string;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'match' | 'transfer' | 'store' | 'system';
  read: boolean;
}

export interface OfflineAction {
  id: string;
  actionType: string;
  payloadDescription: string;
  timestamp: string;
  status: 'pending' | 'synced' | 'conflict';
}

export interface SystemConfig {
  activeSeason: string;
  registrationOpen: boolean;
  scoringWindowOpen: boolean;
  smsNotifications: boolean;
  demoModeNotice: boolean;
}
