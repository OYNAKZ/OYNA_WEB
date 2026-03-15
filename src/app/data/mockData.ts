export interface PC {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'reserved';
  user: string | null;
  sessionTime: string | null;
  temperature: number;
  specs: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  totalSessions: number;
  totalHours: number;
  joinDate: string;
  avatar: string;
}

export interface Reservation {
  id: string;
  pcId: string;
  pcName: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'topup' | 'session' | 'reservation';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface Activity {
  id: string;
  type: 'login' | 'logout' | 'reservation' | 'payment';
  user: string;
  pc?: string;
  time: string;
  description: string;
}

export const pcs: PC[] = [
  { id: '1', name: 'Gaming-01', status: 'reserved', user: 'Alex Johnson', sessionTime: '1h 23m', temperature: 62, specs: 'RTX 4080, i9-13900K' },
  { id: '2', name: 'Gaming-02', status: 'online', user: 'Sarah Chen', sessionTime: '0h 45m', temperature: 58, specs: 'RTX 4080, i9-13900K' },
  { id: '3', name: 'Gaming-03', status: 'online', user: 'Mike Davis', sessionTime: '2h 15m', temperature: 67, specs: 'RTX 4080, i9-13900K' },
  { id: '4', name: 'Gaming-04', status: 'offline', user: null, sessionTime: null, temperature: 35, specs: 'RTX 4080, i9-13900K' },
  { id: '5', name: 'Gaming-05', status: 'online', user: 'Emma Wilson', sessionTime: '0h 32m', temperature: 55, specs: 'RTX 4070 Ti, i7-13700K' },
  { id: '6', name: 'Gaming-06', status: 'offline', user: null, sessionTime: null, temperature: 33, specs: 'RTX 4070 Ti, i7-13700K' },
  { id: '7', name: 'Gaming-07', status: 'reserved', user: 'John Smith', sessionTime: '1h 55m', temperature: 64, specs: 'RTX 4070 Ti, i7-13700K' },
  { id: '8', name: 'Gaming-08', status: 'online', user: 'Lisa Brown', sessionTime: '3h 12m', temperature: 71, specs: 'RTX 4070 Ti, i7-13700K' },
  { id: '9', name: 'Standard-01', status: 'offline', user: null, sessionTime: null, temperature: 31, specs: 'RTX 4060, i5-13600K' },
  { id: '10', name: 'Standard-02', status: 'online', user: 'Tom Garcia', sessionTime: '0h 18m', temperature: 52, specs: 'RTX 4060, i5-13600K' },
  { id: '11', name: 'Standard-03', status: 'offline', user: null, sessionTime: null, temperature: 32, specs: 'RTX 4060, i5-13600K' },
  { id: '12', name: 'Standard-04', status: 'online', user: 'Amy Lee', sessionTime: '1h 05m', temperature: 59, specs: 'RTX 4060, i5-13600K' },
];

export const users: User[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@email.com', balance: 45.50, totalSessions: 127, totalHours: 342, joinDate: '2024-01-15', avatar: 'AJ' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@email.com', balance: 23.00, totalSessions: 89, totalHours: 245, joinDate: '2024-02-20', avatar: 'SC' },
  { id: '3', name: 'Mike Davis', email: 'mike.d@email.com', balance: 67.25, totalSessions: 156, totalHours: 478, joinDate: '2023-11-05', avatar: 'MD' },
  { id: '4', name: 'Emma Wilson', email: 'emma.w@email.com', balance: 12.75, totalSessions: 45, totalHours: 123, joinDate: '2024-03-10', avatar: 'EW' },
  { id: '5', name: 'John Smith', email: 'john.s@email.com', balance: 89.00, totalSessions: 203, totalHours: 612, joinDate: '2023-09-12', avatar: 'JS' },
  { id: '6', name: 'Lisa Brown', email: 'lisa.b@email.com', balance: 34.50, totalSessions: 112, totalHours: 289, joinDate: '2024-01-28', avatar: 'LB' },
  { id: '7', name: 'Tom Garcia', email: 'tom.g@email.com', balance: 56.75, totalSessions: 178, totalHours: 445, joinDate: '2023-10-22', avatar: 'TG' },
  { id: '8', name: 'Amy Lee', email: 'amy.l@email.com', balance: 15.25, totalSessions: 67, totalHours: 156, joinDate: '2024-02-14', avatar: 'AL' },
];

export const reservations: Reservation[] = [
  { id: '1', pcId: '1', pcName: 'Gaming-01', userId: '1', userName: 'Alex Johnson', startTime: '2026-03-15T14:00:00', endTime: '2026-03-15T16:00:00', status: 'active' },
  { id: '2', pcId: '7', pcName: 'Gaming-07', userId: '5', userName: 'John Smith', startTime: '2026-03-15T15:00:00', endTime: '2026-03-15T18:00:00', status: 'active' },
  { id: '3', pcId: '3', pcName: 'Gaming-03', userId: '2', userName: 'Sarah Chen', startTime: '2026-03-15T18:00:00', endTime: '2026-03-15T20:00:00', status: 'upcoming' },
  { id: '4', pcId: '5', pcName: 'Gaming-05', userId: '4', userName: 'Emma Wilson', startTime: '2026-03-16T10:00:00', endTime: '2026-03-16T12:00:00', status: 'upcoming' },
  { id: '5', pcId: '2', pcName: 'Gaming-02', userId: '3', userName: 'Mike Davis', startTime: '2026-03-16T14:00:00', endTime: '2026-03-16T17:00:00', status: 'upcoming' },
  { id: '6', pcId: '8', pcName: 'Gaming-08', userId: '6', userName: 'Lisa Brown', startTime: '2026-03-14T16:00:00', endTime: '2026-03-14T18:00:00', status: 'completed' },
];

export const payments: Payment[] = [
  { id: '1', userId: '1', userName: 'Alex Johnson', amount: 50.00, type: 'topup', status: 'completed', date: '2026-03-15T10:30:00' },
  { id: '2', userId: '2', userName: 'Sarah Chen', amount: 15.50, type: 'session', status: 'completed', date: '2026-03-15T11:15:00' },
  { id: '3', userId: '5', userName: 'John Smith', amount: 25.00, type: 'reservation', status: 'completed', date: '2026-03-15T12:00:00' },
  { id: '4', userId: '3', userName: 'Mike Davis', amount: 100.00, type: 'topup', status: 'completed', date: '2026-03-15T13:20:00' },
  { id: '5', userId: '4', userName: 'Emma Wilson', amount: 8.75, type: 'session', status: 'completed', date: '2026-03-15T14:45:00' },
  { id: '6', userId: '6', userName: 'Lisa Brown', amount: 30.00, type: 'topup', status: 'pending', date: '2026-03-15T15:10:00' },
  { id: '7', userId: '7', userName: 'Tom Garcia', amount: 12.50, type: 'session', status: 'completed', date: '2026-03-14T16:30:00' },
  { id: '8', userId: '8', userName: 'Amy Lee', amount: 20.00, type: 'topup', status: 'completed', date: '2026-03-14T18:00:00' },
];

export const activities: Activity[] = [
  { id: '1', type: 'login', user: 'Sarah Chen', pc: 'Gaming-02', time: '2 min ago', description: 'Started session on Gaming-02' },
  { id: '2', type: 'payment', user: 'Alex Johnson', time: '5 min ago', description: 'Added $50.00 to balance' },
  { id: '3', type: 'reservation', user: 'John Smith', pc: 'Gaming-07', time: '8 min ago', description: 'Reserved Gaming-07 for 3 hours' },
  { id: '4', type: 'logout', user: 'David Martinez', pc: 'Standard-04', time: '12 min ago', description: 'Ended session (2h 15m)' },
  { id: '5', type: 'login', user: 'Emma Wilson', pc: 'Gaming-05', time: '18 min ago', description: 'Started session on Gaming-05' },
  { id: '6', type: 'payment', user: 'Mike Davis', time: '22 min ago', description: 'Added $100.00 to balance' },
  { id: '7', type: 'login', user: 'Tom Garcia', pc: 'Standard-02', time: '25 min ago', description: 'Started session on Standard-02' },
  { id: '8', type: 'logout', user: 'Rachel Kim', pc: 'Gaming-06', time: '30 min ago', description: 'Ended session (1h 45m)' },
];

export const revenueData = [
  { date: 'Mon', revenue: 485, sessions: 32 },
  { date: 'Tue', revenue: 520, sessions: 38 },
  { date: 'Wed', revenue: 445, sessions: 29 },
  { date: 'Thu', revenue: 580, sessions: 42 },
  { date: 'Fri', revenue: 720, sessions: 56 },
  { date: 'Sat', revenue: 890, sessions: 68 },
  { date: 'Sun', revenue: 650, sessions: 48 },
];
