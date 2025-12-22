import { useState, useEffect, FormEvent } from 'react';
import { UserPlus, Loader2, X } from 'lucide-react';
import { api } from '../services/api';
import { Campus } from '../types';

interface AddCampusAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddCampusAdminForm({ onSuccess, onCancel }: AddCampusAdminFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CAMPUS_ADMIN',
    campusId: '',
  });
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCompuses, setIsFetchingCompuses] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCampuses();
  }, []);

  const loadCampuses = async () => {
    try {
      const data = await api.getCampuses();
      setCampuses(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, campusId: data[0].id?.toString() || '' }));
      }
    } catch (err) {
      console.error('Failed to load campuses', err);
      setError('Failed to load campuses list');
    } finally {
      setIsFetchingCompuses(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.createStudent(formData); // Using createStudent which supports role & campusId as per plan
      onSuccess();
    } catch (err) {
      setError('Failed to create campus admin. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Campus Admin
          </h1>
          <p className="text-gray-600">
            Register an administrator for a campus
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                placeholder="e.g. Dean Smith"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                placeholder="dean@example.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Campus
              </label>
              {isFetchingCompuses ? (
                <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
              ) : (
                <select
                  name="campusId"
                  required
                  value={formData.campusId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                >
                  <option value="">Select a Campus</option>
                  {campuses.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isFetchingCompuses}
              className="px-6 py-2 rounded-lg text-white font-medium hover:bg-blue-700 bg-blue-600 transition flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
