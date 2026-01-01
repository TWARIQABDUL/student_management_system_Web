import { useState, useEffect } from 'react';
import { Users, CreditCard, LogIn, Loader2, Smartphone, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StudentsTab from '../components/StudentsTab';
import AccessLogsTab from '../components/AccessLogsTab';
import SettingsTab from '../components/SettingsTab';
import AddStudentForm from '../components/AddStudentForm';
import { api } from '../services/api';
import { DashboardStats, Campus } from '../types';
import { useAuth } from '../context/AuthContext';

export default function CampusAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [campusData, setCampusData] = useState<Campus | null>(user?.campus || null);

  const primaryColor = user?.campus?.primaryColor || '#3B82F6';
  const activeCampusId = campusData?.id || campusData?.campusId;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    let currentCampusId = user?.campus?.id || user?.campus?.campusId;
    let fetchedCampus: Campus | null = null;

    try {
        const [statsData] = await Promise.all([
          api.getDashboardStats('CAMPUS_ADMIN'),
        ]);
        setStats(statsData);

        if (currentCampusId) {
            fetchedCampus = await api.getCampus(String(currentCampusId));
        } else if (user?.campus?.name) {
             // Fallback: try to derive campus ID from students list since user object is missing it
             // and getCampuses() is restricted.
             try {
                const students = await api.getStudents();
                const matchedStudent = students.find(s => s.campus.name === user.campus?.name);
                if (matchedStudent?.campus?.id || matchedStudent?.campus?.campusId) {
                    currentCampusId = matchedStudent.campus.id || matchedStudent.campus.campusId;
                    fetchedCampus = await api.getCampus(String(currentCampusId));
                } else {
                     console.warn('Could not derive campus ID from students.');
                }
             } catch (err) {
                 console.warn('Failed to derive campus ID from students', err);
             }
        }
        
        if (fetchedCampus) setCampusData(fetchedCampus);
    } catch (error) {
        console.error('Failed to load dashboard data', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const campusId = campusData?.id || campusData?.campusId;
    
    if (campusData?.buildStatus === 'IN_PROGRESS' && campusId) {
        interval = setInterval(async () => {
            const data = await api.getCampus(String(campusId));
            setCampusData(data);
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [campusData?.buildStatus, campusData?.id, campusData?.campusId]);

  const handleBuildApk = async () => {
    const campusId = campusData?.id || campusData?.campusId;
    if (!campusId) {
        alert('Cannot start build: Campus ID not found.');
        return;
    }
    
    try {
      await api.startBuild(String(campusId));
      setCampusData(prev => prev ? ({ ...prev, buildStatus: 'IN_PROGRESS' }) : null);
    } catch (error) {
      console.error('Failed to start build', error);
      alert('Failed to start build');
    }
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
                      onClick={() => setActiveTab('add-student')}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition text-left"
                      style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}05` }}
                    >
                      <div className="w-8 h-8 mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                        <span className="text-xl">+</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Add Student</h3>
                      <p className="text-sm text-gray-600">Register new student</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (!activeCampusId) return;
                        if (campusData.buildStatus === 'SUCCESS' && campusData.apkUrl) {
                            window.open(campusData.apkUrl, '_blank');
                        } else if (campusData.buildStatus !== 'IN_PROGRESS') {
                            handleBuildApk();
                        }
                      }}
                      disabled={!activeCampusId || campusData.buildStatus === 'IN_PROGRESS'}
                      className={`p-4 border-2 border-gray-200 rounded-lg transition text-left relative ${
                        !activeCampusId ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'
                      }`}
                    >
                      {!campusData?.buildStatus || !activeCampusId ? (
                         <Smartphone className="w-8 h-8 mb-2" style={{ color: 'gray' }} />
                      ) : campusData.buildStatus === 'IN_PROGRESS' ? (
                         <Loader2 className="w-8 h-8 mb-2 animate-spin" style={{ color: primaryColor }} />
                       ) : campusData.buildStatus === 'SUCCESS' && campusData.apkUrl ? (
                          <Download className="w-8 h-8 mb-2" style={{ color: primaryColor }} />
                       ) : (
                         <Smartphone className="w-8 h-8 mb-2" style={{ color: primaryColor }} />
                      )}
                      
                      <h3 className="font-semibold text-gray-900">
                        {!activeCampusId ? 'Campus Unavailable' :
                         campusData.buildStatus === 'IN_PROGRESS' ? 'Building App...' : 
                         campusData.buildStatus === 'SUCCESS' && campusData.apkUrl ? 'Download App' : 'Build App'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {!activeCampusId ? 'Contact Super Admin' :
                         campusData.buildStatus === 'IN_PROGRESS' ? 'Please wait' : 
                         campusData.buildStatus === 'SUCCESS' && campusData.apkUrl ? 'Get latest APK' : 'Generate Android App'}
                      </p>
                    </button>
                    
                    {campusData?.buildStatus === 'SUCCESS' && !campusData.apkUrl && (
                        <p className="mt-2 text-xs text-amber-600">
                            Build reported success but APK URL is missing. Try rebuilding or contact support.
                        </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'students' && <StudentsTab primaryColor={primaryColor} />}
        {activeTab === 'access-logs' && <AccessLogsTab primaryColor={primaryColor} />}
        {activeTab === 'settings' && <SettingsTab primaryColor={primaryColor} />}
        {activeTab === 'add-student' && (
          <AddStudentForm
            primaryColor={primaryColor}
            onSuccess={() => setActiveTab('students')}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}
      </div>
    </div>
  );
}
