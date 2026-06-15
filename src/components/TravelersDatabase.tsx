import { useState } from 'react';
import { Database, Search, Plus, CheckCircle, XCircle, Edit, Trash2, Filter, X } from 'lucide-react';
import { Layout } from './Layout';
import { addActionLog } from '../utils/mockStorage';

interface Traveler {
  id: number;
  name: string;
  passportNumber: string;
  nationality: string;
  status: 'authorized' | 'not-authorized';
  lastVerification: string;
}

export function TravelersDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'authorized' | 'not-authorized'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      passportNumber: 'EG123456',
      nationality: 'Egyptian',
      status: 'authorized',
      lastVerification: '2/28/2026',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      passportNumber: 'US789012',
      nationality: 'American',
      status: 'authorized',
      lastVerification: '3/1/2026',
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      passportNumber: 'SA345678',
      nationality: 'Saudi',
      status: 'not-authorized',
      lastVerification: 'Never',
    },
    {
      id: 4,
      name: 'Emily Chen',
      passportNumber: 'CN901234',
      nationality: 'Chinese',
      status: 'not-authorized',
      lastVerification: '3/2/2026',
    },
  ]);

  const [currentTraveler, setCurrentTraveler] = useState<Traveler | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    nationality: '',
    status: 'authorized' as 'authorized' | 'not-authorized',
  });

  const filteredTravelers = travelers.filter((traveler) => {
    const matchesSearch =
      traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      traveler.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      traveler.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || traveler.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'not-authorized':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authorized':
        return <CheckCircle className="w-4 h-4" />;
      case 'not-authorized':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTraveler: Traveler = {
      id: travelers.length + 1, // Simple ID generation
      name: formData.name,
      passportNumber: formData.passportNumber,
      nationality: formData.nationality,
      status: formData.status,
      lastVerification: 'Never',
    };
    setTravelers([...travelers, newTraveler]);

    addActionLog({
      user: 'Admin User',
      action: 'Add Traveler',
      details: `Added new traveler: ${newTraveler.name} (${newTraveler.passportNumber})`
    });

    setShowAddModal(false);
    setFormData({ name: '', passportNumber: '', nationality: '', status: 'authorized' });
  };

  const handleEditClick = (traveler: Traveler) => {
    setCurrentTraveler(traveler);
    setFormData({
      name: traveler.name,
      passportNumber: traveler.passportNumber,
      nationality: traveler.nationality,
      status: traveler.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTraveler) return;

    setTravelers(travelers.map(t =>
      t.id === currentTraveler.id
        ? { ...t, ...formData }
        : t
    ));

    addActionLog({
      user: 'Admin User',
      action: 'Edit Traveler',
      details: `Updated details for traveler: ${currentTraveler.name} (${currentTraveler.passportNumber})`
    });

    setShowEditModal(false);
    setCurrentTraveler(null);
  };

  const handleDeleteClick = (traveler: Traveler) => {
    setCurrentTraveler(traveler);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!currentTraveler) return;
    setTravelers(travelers.filter(t => t.id !== currentTraveler.id));

    addActionLog({
      user: 'Admin User',
      action: 'Delete Traveler',
      details: `Deleted traveler: ${currentTraveler.name} (${currentTraveler.passportNumber})`
    });

    setShowDeleteModal(false);
    setCurrentTraveler(null);
  };

  return (
    <Layout>
      <div className="py-8 px-4 bg-linear-to-br from-gray-50 to-blue-50 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl text-gray-900">Travelers Database</h1>
                  <p className="text-gray-600">{filteredTravelers.length} registered travelers</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData({ name: '', passportNumber: '', nationality: '', status: 'authorized' });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition shadow-lg cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Add Traveler</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, passport, or nationality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="authorized">Authorized</option>
                  <option value="not-authorized">Not Authorized</option>
                </select>
              </div>
            </div>
          </div>

          {/* Travelers Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Passport</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Nationality</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Last Verification</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTravelers.map((traveler) => (
                    <tr key={traveler.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {traveler.name.charAt(0)}
                          </div>
                          <p className="text-sm text-gray-900 font-medium">{traveler.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-mono">{traveler.passportNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{traveler.nationality}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(traveler.status)}`}>
                          {getStatusIcon(traveler.status)}
                          <span className="capitalize">{traveler.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{traveler.lastVerification}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(traveler)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                            title="Edit Traveler"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(traveler)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Delete Traveler"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTravelers.length === 0 && (
              <div className="py-16 text-center">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No travelers found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                {showAddModal ? 'Add New Traveler' : 'Edit Traveler'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input
                  type="text"
                  required
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. A12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. American"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                >
                  <option value="authorized">Authorized</option>
                  <option value="not-authorized">Not Authorized</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
                >
                  {showAddModal ? 'Add Traveler' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">Delete Traveler?</h3>
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete <strong>{currentTraveler?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
