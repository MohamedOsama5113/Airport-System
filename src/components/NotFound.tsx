import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './Layout';
import { AlertCircle, Shield, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect old routes to appropriate pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
      navigate('/admin/login', { replace: true });
    } else if (location.pathname === '/home' || location.pathname === '/iris-scan') {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, navigate]);

  // If redirecting, don't show the 404 page
  if (location.pathname === '/login' || location.pathname === '/signup' ||
    location.pathname === '/home' || location.pathname === '/iris-scan') {
    return null;
  }

  return (
    <Layout>
      <div className="py-20 px-4 bg-linear-to-br from-gray-50 to-blue-50 min-h-[calc(100vh-(--spacing(16))-(--spacing(64)))]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-lg p-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-6xl text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Please return to the admin dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition shadow-lg shadow-blue-500/30"
              >
                <Shield className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}