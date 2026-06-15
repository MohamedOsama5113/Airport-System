import { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { Layout } from './Layout';
import { addActionLog } from '../utils/mockStorage';

export function SystemSettings() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    systemName: 'Airport Control',
    securityLevel: 'medium',
    autoArchive: true,
  });

  const handleSave = () => {
    setSaved(true);

    addActionLog({
      user: 'Admin User',
      action: 'Settings Update',
      details: `Updated system settings (Security: ${formData.securityLevel}, Auto-Archive: ${formData.autoArchive})`
    });

    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-gray-50 to-blue-50 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure system parameters</p>
              </div>
            </div>
          </div>

          {/* Save Notification */}
          {saved && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-900 font-medium">Settings saved successfully!</p>
            </div>
          )}

          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                  <input
                    type="text"
                    value={formData.systemName}
                    onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Security Level</label>
                  <select
                    value={formData.securityLevel}
                    onChange={(e) => setFormData({ ...formData, securityLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="autoArchive"
                    checked={formData.autoArchive}
                    onChange={(e) => setFormData({ ...formData, autoArchive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="autoArchive" className="text-gray-700 font-medium cursor-pointer select-none">
                    Auto-archive logs after 30 days
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition transform active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
