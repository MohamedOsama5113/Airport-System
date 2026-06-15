import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Edit, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { Layout } from './Layout';
import { PageHeader } from './PageHeader';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Administrator',
    role: 'System Administrator',
    location: 'Cairo International Airport',
    email: 'admin@airport-security.gov',
    phone: '+20 123 456 7890',
    joined: 'January 1, 2026'
  });

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Profile"
            subtitle="Manage your account information"
            icon={<Shield className="w-7 h-7 text-white" />}
            iconContainerClassName="bg-linear-to-br from-blue-600 to-blue-500"
          />

          <div className="max-w-5xl mx-auto">

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100 dark:border-slate-700">
              <div className="px-5 sm:px-8 py-6 sm:py-8">
                <div className="flex justify-end mb-5">
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${isEditing
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700'
                      }`}
                  >
                    {isEditing ? (
                      <>
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-end gap-5 sm:gap-6 mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-lg">
                    <div className="w-full h-full bg-linear-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                      {userData.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="border-b-2 border-blue-500 focus:outline-none bg-transparent text-gray-900 dark:text-slate-100"
                        />
                      ) : userData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-slate-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      {userData.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-5 border-t border-gray-100 dark:border-slate-700">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-start gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/70 dark:bg-slate-800/60">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Email Address</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-slate-100 break-all">{userData.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/70 dark:bg-slate-800/60">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-300">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Phone Number</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-slate-100">{userData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-start gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/70 dark:bg-slate-800/60">
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Location</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={userData.location}
                            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-slate-100">{userData.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/70 dark:bg-slate-800/60">
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-300">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Joined Date</p>
                        <p className="text-gray-900 dark:text-slate-100">{userData.joined}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-800/40 rounded-xl transition shadow-sm hover:shadow active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
