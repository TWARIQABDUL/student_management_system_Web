export interface Campus {
  id?: string | number;
  name: string;
  abrev: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor?: string;
  logoUrl?: string;
  cardTextColor?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CAMPUS_ADMIN' | 'GUARD' | 'STUDENT';
  campus?: Campus;
  nfcToken?: string;
  walletBalance?: number;
  validUntil?: string;
  active?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface GateLog {
  id?: string;
  studentName: string;
  time: string;
  status: 'ALLOWED' | 'DENIED' | 'BLOCKED';
  gateId: string;
}

export interface Student {
  id?: string;
  name: string;
  email: string;
  nfcToken: string;
  role: string;
  walletBalance: number;
  validUntil: string;
  campus: Campus;
  active: boolean;
}

export interface DashboardStats {
  totalCampuses?: number;
  totalRevenue?: number;
  systemHealth?: number;
  totalStudents?: number;
  activeCards?: number;
  todayEntries?: number;
}
