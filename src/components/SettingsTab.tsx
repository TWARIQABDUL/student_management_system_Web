import { useAuth } from '../context/AuthContext';
import { Building2, Palette } from 'lucide-react';

interface SettingsTabProps {
  primaryColor: string;
}

export default function SettingsTab({ primaryColor }: SettingsTabProps) {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Campus Settings
        </h1>
        <p className="text-gray-600">
          Configure your campus branding and preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Building2 className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Campus Information</h2>
              <p className="text-sm text-gray-600">Basic campus details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campus Name
              </label>
              <input
                type="text"
                value={user?.campus?.name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campus Logo URL
              </label>
              <input
                type="text"
                value={user?.campus?.logoUrl || ''}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Palette className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Theme Colors</h2>
              <p className="text-sm text-gray-600">Customize your dashboard appearance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={user?.campus?.primaryColor || '#3B82F6'}
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={user?.campus?.primaryColor || '#3B82F6'}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition font-mono"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={user?.campus?.secondaryColor || '#1E202C'}
                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={user?.campus?.secondaryColor || '#1E202C'}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition font-mono"
                  readOnly
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                className="px-6 py-3 text-white rounded-lg font-semibold transition hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Color Preview</h3>
          <p className="text-sm text-gray-600 mb-4">
            See how your colors look across different components
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg mb-2"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <p className="text-xs text-gray-600">Primary</p>
            </div>
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg mb-2"
                style={{ backgroundColor: user?.campus?.secondaryColor }}
              ></div>
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg mb-2 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                Button
              </div>
              <p className="text-xs text-gray-600">Button</p>
            </div>
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg mb-2 border-2"
                style={{ borderColor: primaryColor }}
              ></div>
              <p className="text-xs text-gray-600">Border</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
