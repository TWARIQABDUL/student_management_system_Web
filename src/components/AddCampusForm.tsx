import { useState, FormEvent } from 'react';
import { Building2, Loader2, X } from 'lucide-react';
import { api } from '../services/api';

interface AddCampusFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddCampusForm({ onSuccess, onCancel }: AddCampusFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    abrev: '',
    primaryColor: '#',
    secondaryColor: '#',
    backgroundColor: '#1E202C',
    logoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.createCampus(formData);
      onSuccess();
    } catch (err) {
      setError('Failed to create campus. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register New Campus
          </h1>
          <p className="text-gray-600">
            Create a new campus environment
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column: Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Campus Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus Name
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    placeholder="e.g. Red Rock College"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abbreviation
                </label>
                <input
                    type="text"
                    name="abrev"
                    required
                    value={formData.abrev}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    placeholder="e.g. RRC"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                </label>
                <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    placeholder="https://example.com/logo.png"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color (Brand)
                </label>
                <div className="flex space-x-2">
                    <input
                    type="color"
                    name="primaryColor"
                    required
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                    type="text"
                    name="primaryColor"
                    required
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color (Accents)
                </label>
                <div className="flex space-x-2">
                    <input
                    type="color"
                    name="secondaryColor"
                    required
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                    type="text"
                    name="secondaryColor"
                    required
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color (App Body)
                </label>
                <div className="flex space-x-2">
                    <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleChange}
                    className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                    type="text"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:blue-500 focus:border-transparent transition"
                    />
                </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 space-x-3">
                <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg text-white font-medium hover:bg-blue-700 bg-blue-600 transition flex items-center shadow-md hover:shadow-lg"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                    </>
                ) : (
                    <>
                    <Building2 className="w-5 h-5 mr-2" />
                    Create Campus
                    </>
                )}
                </button>
            </div>
            </form>
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col items-center">
             <h2 className="text-xl font-semibold text-gray-800 mb-6">App Preview</h2>
             {/* Mobile Phone Mockup */}
             <div className="relative w-[300px] h-[600px] rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden bg-black z-0">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-50"></div>
                
                {/* Status Bar (Absolute Overlay) */}
                <div className="absolute top-0 left-0 w-full h-8 z-40 flex justify-between px-6 items-end pb-1">
                    <span className="text-[10px] text-white font-medium">11:20</span>
                    <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full border border-white/30"></div>
                        <div className="w-3 h-3 rounded-full border border-white/30"></div>
                    </div>
                </div>

                {/* App Content */}
                <div 
                    className="w-full h-full flex flex-col relative pt-8"
                    style={{ backgroundColor: formData.backgroundColor || '#000000' }}
                >
                    {/* Header */}
                    <div className="p-4 pt-4 flex items-center justify-between">
                         {/* Centered Title */}
                        <div className="w-8"></div> {/* Spacer for alignment */}
                        <h3 className="text-white font-bold text-lg text-center flex-1">{formData.name || 'Tech University'}</h3>
                        <div className="w-8 flex justify-end">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </div>

                    {/* Alert Pill */}
                    <div className="flex justify-center mt-4 mb-6">
                        <div className="px-4 py-2 rounded-full border border-red-500/50 bg-red-500/10 flex items-center space-x-2">
                            <span className="text-red-500 text-xs font-bold">⚠ NFC NOT SUPPORTED</span>
                        </div>
                    </div>

                    {/* Main Wallet Card */}
                    <div className="px-5 w-full">
                        <div 
                            className="rounded-3xl p-5 relative overflow-hidden w-full flex flex-col justify-between min-h-[180px]"
                            style={{ 
                                backgroundColor: formData.primaryColor || '#1E1E2E',
                                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* Card Background Texture/Gradient */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            
                            {/* Card Header Icons */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="text-red-400 bg-red-400/10 p-1.5 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <div className="text-white/30">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-10.571a9 9 0 0113.858 0M2.929 7.071a13 13 0 0119.08 0" />
                                    </svg>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className="mb-4 relative z-10">
                                <h2 className="text-white text-3xl font-bold tracking-tight">$0.00</h2>
                            </div>

                            {/* User Info & QR */}
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-white text-[10px] font-bold tracking-wider mb-0.5 opacity-90">MFURAYACU ABUBAKAR</p>
                                    <p className="text-white/60 text-[9px] uppercase font-bold tracking-wide">{formData.abrev || 'UNIV'}</p>
                                </div>
                                <div className="bg-white p-1 rounded-md">
                                    {/* Mock QR */}
                                    <div className="w-7 h-7 bg-black pattern-dots opacity-90"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Space / Content */}
                    <div className="flex-1"></div>

                    {/* Bottom Navigation */}
                     <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-end">
                        <div className="flex flex-col items-center space-y-1">
                            <div 
                                className="p-1 rounded-lg"
                                style={{ color: formData.secondaryColor || '#3B82F6' }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span 
                                className="text-xs font-medium"
                                style={{ color: formData.secondaryColor || '#3B82F6' }}
                            >
                                My Wallet
                            </span>
                        </div>

                         <div className="flex flex-col items-center space-y-1 text-gray-500">
                            <div className="p-1">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium">Access Logs</span>
                        </div>
                     </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-500 rounded-full z-20"></div>
             </div>
             <p className="mt-4 text-sm text-gray-500">Live preview of student app interface</p>
        </div>
      </div>
    </div>
  );
}
