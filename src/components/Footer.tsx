import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleDummyClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    alert(`${title} page is under construction.`);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg text-white leading-tight">Airport Security</h3>
                <p className="text-sm text-gray-400 leading-tight">Admin Control System</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Advanced biometric security system for seamless airport travel verification.
              Ensuring safe and efficient passenger processing with cutting-edge iris recognition technology.
            </p>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="text-white mb-4 text-sm">Admin Panel</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin" className="hover:text-white transition">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/verification" className="hover:text-white transition">Verification</Link>
              </li>
              <li>
                <Link to="/admin/logs" className="hover:text-white transition">Logs</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4 text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-blue-400" />
                <span>support@airport-security.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400" />
                <span>International Airport Terminal 3</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Airport Security System. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" onClick={(e) => handleDummyClick(e, 'Terms of Service')} className="hover:text-white transition">Terms of Service</a>
            <a href="#" onClick={(e) => handleDummyClick(e, 'Privacy Policy')} className="hover:text-white transition">Privacy</a>
            <a href="#" onClick={(e) => handleDummyClick(e, 'Security Policy')} className="hover:text-white transition">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}