import React, { useState } from 'react';
import { KYCSubmission, KYCStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

interface AdminDashboardProps {
  submissions: KYCSubmission[];
}

const COLORS = ['#10B981', '#FBBF24', '#EF4444', '#3B82F6'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Derived Stats
  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === KYCStatus.APPROVED).length,
    pending: submissions.filter(s => s.status === KYCStatus.MANUAL_REVIEW).length,
    rejected: submissions.filter(s => s.status === KYCStatus.REJECTED).length,
  };

  const riskDistribution = [
    { name: 'Low Risk', value: submissions.filter(s => s.riskScore < 30).length },
    { name: 'Medium Risk', value: submissions.filter(s => s.riskScore >= 30 && s.riskScore < 70).length },
    { name: 'High Risk', value: submissions.filter(s => s.riskScore >= 70).length },
  ];

  const filteredSubmissions = submissions.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Submissions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Auto-Approved</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Manual Review</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Rejected (High Risk)</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Status Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Verification Statuses</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Approved', value: stats.approved },
                    { name: 'Pending', value: stats.pending },
                    { name: 'Rejected', value: stats.rejected },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Approved', value: stats.approved },
                    { name: 'Pending', value: stats.pending },
                    { name: 'Rejected', value: stats.rejected },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Verification Queue</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select 
                className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value={KYCStatus.APPROVED}>Approved</option>
                <option value={KYCStatus.MANUAL_REVIEW}>Manual Review</option>
                <option value={KYCStatus.REJECTED}>Rejected</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{sub.fullName}</div>
                        <div className="text-slate-400 text-xs">{sub.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-semibold tracking-wide">
                      {sub.documentType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-12 h-1.5 rounded-full overflow-hidden bg-slate-200`}>
                          <div 
                            className={`h-full ${
                              sub.riskScore > 70 ? 'bg-red-500' : 
                              sub.riskScore > 30 ? 'bg-amber-500' : 'bg-green-500'
                            }`} 
                            style={{ width: `${sub.riskScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                           sub.riskScore > 70 ? 'text-red-600' : 
                           sub.riskScore > 30 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {sub.riskScore}/100
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === KYCStatus.APPROVED ? 'bg-green-100 text-green-800' :
                        sub.status === KYCStatus.REJECTED ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === KYCStatus.APPROVED && <CheckCircle className="w-3 h-3 mr-1" />}
                        {sub.status === KYCStatus.REJECTED && <XCircle className="w-3 h-3 mr-1" />}
                        {sub.status === KYCStatus.MANUAL_REVIEW && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-900 font-medium text-xs flex items-center justify-end w-full">
                        <Eye className="w-4 h-4 mr-1" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No submissions found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;