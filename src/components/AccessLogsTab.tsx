import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { GateLog } from '../types';

interface AccessLogsTabProps {
  primaryColor: string;
}

export default function AccessLogsTab({ primaryColor }: AccessLogsTabProps) {
  const [logs, setLogs] = useState<GateLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    const data = await api.getGateHistory();
    setLogs(data);
    setIsLoading(false);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Logs
          </h1>
          <p className="text-gray-600">
            Real-time gate entry and exit monitoring
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: primaryColor }} />
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      log.status === 'ALLOWED'
                        ? 'bg-green-100'
                        : log.status === 'DENIED'
                        ? 'bg-red-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    {log.status === 'ALLOWED' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : log.status === 'DENIED' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {log.studentName}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(log.time)}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(log.time)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Gate: {log.gateId}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      log.status === 'ALLOWED'
                        ? 'bg-green-100 text-green-700'
                        : log.status === 'DENIED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
