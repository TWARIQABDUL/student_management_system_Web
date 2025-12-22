import { LoginResponse, GateLog, Student, DashboardStats, Campus } from '../types';

const API_BASE_URL = 'https://student-smart-card-backend.onrender.com/api/v1';



const mockGateLogs: GateLog[] = [
  { id: '1', studentName: 'John Doe', time: new Date().toISOString(), status: 'ALLOWED', gateId: 'GATE-1' },
  { id: '2', studentName: 'Jane Smith', time: new Date(Date.now() - 300000).toISOString(), status: 'ALLOWED', gateId: 'GATE-2' },
  { id: '3', studentName: 'Bob Wilson', time: new Date(Date.now() - 600000).toISOString(), status: 'DENIED', gateId: 'GATE-1' },
];

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // The backend may return 200 OK for FORCE_CHANGE_PASSWORD
      // or error codes for actual failures.
      if (!response.ok) {
         // Try to parse error message if available
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async changeFirstPassword(email: string, oldPassword: string, newPassword: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-first-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to change password');
      }
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  async getGateHistory(): Promise<GateLog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/gate/history`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch gate history');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return mockGateLogs;
    }
  },

  async getStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch students');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  async createStudent(data: any): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create student');
      return await response.json();
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  },

  async getCampuses(): Promise<Campus[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/campuses`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch campuses');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch campuses:', error);
      throw error;
    }
  },

  async createCampus(data: Campus): Promise<Campus> {
    try {
      const response = await fetch(`${API_BASE_URL}/campuses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create campus');
      return await response.json();
    } catch (error) {
      console.error('Failed to create campus:', error);
      throw error;
    }
  },

  async toggleStudentStatus(studentId: string, active: boolean): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ active }),
      });

      if (!response.ok) throw new Error('Failed to update student status');
      return await response.json();
    } catch (error) {
      console.error('Failed to update student status:', error);
      throw error;
    }
  },

  async getDashboardStats(_role: string): Promise<DashboardStats> {
    try {
      const [students, logs] = await Promise.all([
        this.getStudents(),
        this.getGateHistory() // Use getGateHistory for entries if available, or just mock it if it fails inside
      ]);
      
      const studentList = students.filter(u => u.role === 'STUDENT');
      const activeCards = studentList.filter(s => s.active).length;
      
      // Calculate today's entries
      const today = new Date().toDateString();
      const todayEntries = logs.filter(log => 
        new Date(log.time).toDateString() === today && log.status === 'ALLOWED'
      ).length;

      return {
        totalStudents: studentList.length,
        activeCards: activeCards,
        todayEntries: todayEntries,
      };
    } catch (error) {
      console.warn('Failed to derive stats, returning fallbacks:', error);
      return {
        totalStudents: 0,
        activeCards: 0,
        todayEntries: 0,
      };
    }
  },
};
