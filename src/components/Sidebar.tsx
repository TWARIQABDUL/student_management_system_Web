import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, History, Settings, LogOut, Building2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const primaryColor = user?.campus?.primaryColor || '#3B82F6';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const superAdminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campuses', label: 'Campuses', icon: Building2 },
  ];

  const campusAdminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'access-logs', label: 'Access Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = isSuperAdmin ? superAdminMenuItems : campusAdminMenuItems;

  return (
    <div
      className="w-64 min-h-screen text-white flex flex-col"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {user?.campus?.logoUrl ? (
            <img
              src={user.campus.logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <h2 className="font-bold text-lg">
              {user?.campus?.name || 'System Admin'}
            </h2>
            <p className="text-xs text-white/70">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-white/70">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
