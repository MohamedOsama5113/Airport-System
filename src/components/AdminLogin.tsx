import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { addActionLog } from '../utils/mockStorage';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation (in real app would authenticate with backend)
    if (email && password) {
      addActionLog({
        user: email, // Use the entered email as username
        action: 'Login',
        details: 'Admin user logged in successfully'
      });
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-500 to-blue-700 flex items-start justify-center px-4 py-6 sm:items-center sm:py-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl shadow-2xl mb-4">
            <Shield className="w-9 h-9 sm:w-11 sm:h-11 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl text-white mb-2">Airport Security System</h1>
          <p className="text-blue-100">Admin Control Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access the admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@airport.com"
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-left sm:text-right text-blue-600 hover:text-blue-700 transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 text-base sm:text-lg"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-xs sm:text-sm mt-5 sm:mt-6">
          Iris Recognition System v2.0 • Secure Access
        </p>
      </div>
    </div>
  );
}