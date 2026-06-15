import { useNavigate } from 'react-router-dom';
import { Shield, ScanEye, TrendingUp, CheckCircle, XCircle, HelpCircle, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Layout } from './Layout';
import { PageHeader } from './PageHeader';
import { getStats, getLogs } from '../utils/mockStorage';
import { useState, useEffect } from 'react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, success: 0, rejected: 0, unknown: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Load data from local storage
    const refreshData = () => {
      const logs = getLogs();
      const baseStats = getStats();
      setStats({
        ...baseStats,
        unknown: Math.max(logs.length - baseStats.success - baseStats.rejected, 0),
      });
      const recent = logs.slice(0, 3).map(log => {
        // Calculate relative time (simplified)
        const logTime = new Date(log.timestamp).getTime();
        const now = new Date().getTime();
        const diffMs = now - logTime;
        const diffMins = Math.floor(diffMs / 60000);

        let timeString = 'Just now';
        if (diffMins > 0 && diffMins < 60) {
          timeString = `${diffMins} min ago`;
        } else if (diffMins >= 60 && diffMins < 1440) {
          timeString = `${Math.floor(diffMins / 60)} hours ago`;
        } else if (diffMins >= 1440) {
          timeString = `${Math.floor(diffMins / 1440)} days ago`;
        }

        return {
          id: log.id,
          name: log.travelerName,
          passport: log.passportNumber,
          status: log.status,
          time: timeString
        };
      });
      setRecentActivity(recent);
    };

    refreshData();
    const interval = setInterval(refreshData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Dashboard"
            subtitle="Airport Iris Recognition System"
            icon={<LayoutDashboard className="w-7 h-7 text-white" />}
            iconContainerClassName="bg-linear-to-br from-blue-600 to-blue-500"
          />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Verifications</p>
              <p className="text-3xl text-gray-900 dark:text-slate-100">{stats.total.toLocaleString()}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Allowed</p>
              <p className="text-3xl text-gray-900 dark:text-slate-100">{stats.success.toLocaleString()}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Banned</p>
              <p className="text-3xl text-gray-900 dark:text-slate-100">{stats.rejected.toLocaleString()}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Unknown</p>
              <p className="text-3xl text-gray-900 dark:text-slate-100">{stats.unknown.toLocaleString()}</p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <button
              onClick={() => navigate('/admin/verification')}
              className="group relative bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl shadow-lg p-8 pr-20 text-left transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center mb-5">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ScanEye className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl text-white mb-2">Verify Traveler</h3>
              <p className="text-blue-100">Scan traveler iris and verify identity instantly</p>
              <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 w-7 h-7 text-white/90 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900 dark:text-slate-100">Recent Verifications</h2>
              <button
                onClick={() => navigate('/admin/logs')}
                className="text-sm text-blue-600 hover:text-blue-700 transition"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.status === 'Allowed'
                      ? 'bg-green-100'
                      : activity.status === 'Banned'
                        ? 'bg-red-100'
                        : 'bg-yellow-100'
                      }`}>
                      {activity.status === 'Allowed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : activity.status === 'Banned' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Shield className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-slate-100">{activity.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{activity.passport}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${activity.status === 'Allowed'
                      ? 'text-green-600'
                      : activity.status === 'Banned'
                        ? 'text-red-600'
                        : 'text-yellow-700'
                      }`}>
                      {activity.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}