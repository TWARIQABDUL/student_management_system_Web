import { useState, useEffect, CSSProperties } from 'react';
import { Search, UserCheck, UserX, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Student } from '../types';

interface StudentsTabProps {
  primaryColor: string;
}

export default function StudentsTab({ primaryColor }: StudentsTabProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    const data = await api.getStudents();
    setStudents(data);
    setIsLoading(false);
  };

  const toggleStudentStatus = async (studentId: string, currentActive: boolean) => {
    const newActive = !currentActive;
    await api.toggleStudentStatus(studentId, newActive);
    setStudents(students.map(s =>
      (s.id === studentId || s.nfcToken === studentId) ? { ...s, active: newActive } : s
    ));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nfcToken.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Students Management
        </h1>
        <p className="text-gray-600">
          Manage student access and card status
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or card number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
              style={{ '--tw-ring-color': primaryColor } as CSSProperties}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: primaryColor }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    NFC Token
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Wallet
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
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id || student.nfcToken}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {student.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                        {student.nfcToken}
                      </span>
                    </td>
                     <td className="py-4 px-4">
                      <span className="font-medium text-gray-700">
                        ${student.walletBalance.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {student.active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center w-fit space-x-1">
                          <UserCheck className="w-4 h-4" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center w-fit space-x-1">
                          <UserX className="w-4 h-4" />
                          <span>Blocked</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStudentStatus(student.id || student.nfcToken, student.active)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                          student.active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'text-white hover:opacity-90'
                        }`}
                        style={
                          !student.active
                            ? { backgroundColor: primaryColor }
                            : {}
                        }
                      >
                        {student.active ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
