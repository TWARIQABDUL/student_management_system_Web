import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CampusAdminDashboard from './pages/CampusAdminDashboard';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (user.role === 'CAMPUS_ADMIN') {
    return <CampusAdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600">Please use the mobile app.</p>
      </div>
    </div>
  );
}

export default App;
