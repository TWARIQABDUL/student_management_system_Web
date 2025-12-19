import { useState, useEffect } from 'react';
import { Users, CreditCard, LogIn, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StudentsTab from '../components/StudentsTab';
import AccessLogsTab from '../components/AccessLogsTab';
import SettingsTab from '../components/SettingsTab';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';

export default function CampusAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const primaryColor = user?.campus?.primaryColor || '#3B82F6';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    const statsData = await api.getDashboardStats('CAMPUS_ADMIN');
    setStats(statsData);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Campus Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name}
              </p>
              {user?.walletBalance !== undefined && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Balance: ${user.walletBalance.toFixed(2)}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: primaryColor }} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Students"
                    value={stats.totalStudents || 0}
                    icon={Users}
                    color={primaryColor}
                  />
                  <StatCard
                    title="Active Cards"
                    value={stats.activeCards || 0}
                    icon={CreditCard}
                    color={primaryColor}
                  />
                  <StatCard
                    title="Today's Entries"
                    value={stats.todayEntries || 0}
                    icon={LogIn}
                    color={primaryColor}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-left"
                    >
                      <Users className="w-8 h-8 mb-2" style={{ color: primaryColor }} />
                      <h3 className="font-semibold text-gray-900">Manage Students</h3>
                      <p className="text-sm text-gray-600">View and edit student records</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('access-logs')}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-left"
                    >
                      <LogIn className="w-8 h-8 mb-2" style={{ color: primaryColor }} />
                      <h3 className="font-semibold text-gray-900">Access Logs</h3>
                      <p className="text-sm text-gray-600">Monitor gate activity</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-left"
                    >
                      <CreditCard className="w-8 h-8 mb-2" style={{ color: primaryColor }} />
                      <h3 className="font-semibold text-gray-900">Settings</h3>
                      <p className="text-sm text-gray-600">Configure campus settings</p>
                    </button>
                    <button
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-left"
                      style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}05` }}
                    >
                      <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                        <span className="text-xl">+</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Add Student</h3>
                      <p className="text-sm text-gray-600">Register new student</p>
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'students' && <StudentsTab primaryColor={primaryColor} />}
        {activeTab === 'access-logs' && <AccessLogsTab primaryColor={primaryColor} />}
        {activeTab === 'settings' && <SettingsTab primaryColor={primaryColor} />}
      </div>
    </div>
  );
}
