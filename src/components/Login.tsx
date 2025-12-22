import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GraduationCap, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forceChangePassword, setForceChangePassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (forceChangePassword) {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }
        const response = await api.changeFirstPassword(email, password, newPassword);
        // After successful password change, login the user with new password
        // Or if response contains token/user immediately, use that.
        // Assuming response is standard LoginResponse or success message.
        // If it returns a token, we can log them in. 
        if (response.token && response.user) {
            login(response.token, response.user);
        } else {
            // If no token, reset form and ask to login again (or auto-login logic if API supported)
            setForceChangePassword(false);
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('Password changed successfully. Please login with new password.');
        }
      } else {
        const response = await api.login(email, password);
        
        if (response.status === 'FORCE_CHANGE_PASSWORD') {
            setForceChangePassword(true);
            setPassword(''); // Clear password so user enters it again
            setError(response.message || 'First time login. Please change your password.');
        } else if (response.token && response.user) {
            login(response.token, response.user);
        } else {
            setError('Unexpected response from server');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Smart Card System
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {forceChangePassword ? 'Change Password' : 'Admin Dashboard Login'}
          </p>

          {error && (
            <div className={`mb-4 p-3 border rounded-lg text-sm ${
                error.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!forceChangePassword ? (
                <>
                    <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="admin@university.edu"
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your password"
                        required
                    />
                    </div>
                </>
            ) : (
                <>
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
                        Please set a new password for your account.
                    </div>
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter current password"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Re-enter new password"
                            required
                            minLength={6}
                        />
                    </div>
                </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {forceChangePassword ? 'Updating Password...' : 'Signing In...'}
                </>
              ) : (
                forceChangePassword ? 'Set New Password' : 'Sign In'
              )}
            </button>
            
            {forceChangePassword && (
                <button
                    type="button"
                    onClick={() => {
                        setForceChangePassword(false);
                        setPassword('');
                        setError('');
                    }}
                    className="w-full text-gray-500 text-sm hover:text-gray-700 transition"
                >
                    Cancel
                </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
