import { useState, useEffect } from 'react';
import { Building2, DollarSign, Activity, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { Campus, DashboardStats } from '../types';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({});
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [statsData, campusesData] = await Promise.all([
      api.getDashboardStats('SUPER_ADMIN'),
      api.getCampuses(),
    ]);
    setStats(statsData);
    setCampuses(campusesData);
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
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600">
                System-wide overview and management
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Campuses"
                    value={stats.totalCampuses || 0}
                    icon={Building2}
                    color="#3B82F6"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="#10B981"
                  />
                  <StatCard
                    title="System Health"
                    value={stats.systemHealth || 0}
                    icon={Activity}
                    color="#F59E0B"
                    suffix="%"
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Registered Campuses
                    </h2>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      <Plus className="w-5 h-5" />
                      <span>Add Campus</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Campus Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Primary Color
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {campuses.map((campus) => (
                          <tr
                            key={campus.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                {campus.logoUrl ? (
                                  <img
                                    src={campus.logoUrl}
                                    alt={campus.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${campus.primaryColor}20` }}
                                  >
                                    <Building2
                                      className="w-6 h-6"
                                      style={{ color: campus.primaryColor }}
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {campus.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {campus.abrev}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-8 h-8 rounded border border-gray-200"
                                  style={{ backgroundColor: campus.primaryColor }}
                                ></div>
                                <span className="text-sm text-gray-600">
                                  {campus.primaryColor}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Active
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'campuses' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Campus Management
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">Campus management features coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
