import { useState, useEffect } from 'react';
import { History, Search, Filter, Download, Calendar, CheckCircle, XCircle, MapPin, Activity } from 'lucide-react';
import { Layout } from './Layout';
import { PageHeader } from './PageHeader';
import { getLogs, VerificationLog } from '../utils/mockStorage';

export function VerificationLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Allowed' | 'Banned' | 'Unknown'>('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [logs, setLogs] = useState<VerificationLog[]>([]);

  useEffect(() => {
    setLogs(getLogs());
    // Refresh logs every 5 seconds to show updates from other tabs/windows if needed
    const interval = setInterval(() => {
      setLogs(getLogs());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    let matchesDate = true;
    const logDate = new Date(log.timestamp);
    const today = new Date();

    if (dateFilter === 'today') {
      matchesDate = logDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const handleExportLogs = () => {
    const headers = ['ID', 'Traveler', 'Passport', 'Nationality', 'Status', 'Timestamp', 'Operator'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.id,
        `"${log.travelerName}"`,
        log.passportNumber,
        log.nationality,
        log.status,
        `"${log.timestamp}"`,
        log.operator
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'verification_logs.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const allowedCount = filteredLogs.filter((log) => log.status === 'Allowed').length;
  const bannedCount = filteredLogs.filter((log) => log.status === 'Banned').length;
  const unknownCount = filteredLogs.filter((log) => log.status === 'Unknown').length;

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Verification Logs"
            subtitle={`${filteredLogs.length} verification records`}
            icon={<History className="w-7 h-7 text-white" />}
            iconContainerClassName="bg-linear-to-br from-emerald-600 to-cyan-600"
            actions={(
              <button
                onClick={handleExportLogs}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Export Logs</span>
              </button>
            )}
          />

          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, passport, or nationality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="shrink-0 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition border border-red-100"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Allowed</p>
                  <p className="text-2xl text-green-600">{allowedCount}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Banned</p>
                  <p className="text-2xl text-red-600">{bannedCount}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Unknown</p>
                  <p className="text-2xl text-amber-600">{unknownCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="Allowed">Allowed</option>
                    <option value="Banned">Banned</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Traveler</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Passport</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                            {log.travelerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-slate-100">{log.travelerName}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.nationality}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-slate-100">{log.passportNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        {log.status === 'Allowed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Allowed
                          </span>
                        ) : log.status === 'Banned' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg text-xs">
                            <Activity className="w-3.5 h-3.5" />
                            Unknown
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 min-w-40">
                        <p className="text-sm text-gray-900 dark:text-slate-100">{log.confidence.toFixed(2)}%</p>
                        <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, log.confidence)).toFixed(2)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-slate-100">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="py-16 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-slate-400">No logs found</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredLogs.length)} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
              </p>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border border-gray-200 rounded-lg transition ${currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
