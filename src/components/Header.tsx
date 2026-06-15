import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  Home,
  ScanEye,
  History,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { applyTheme, getCurrentTheme, ThemeMode } from "../utils/theme";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentTheme());

  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/admin/login";

  const toggleTheme = () => {
    const nextTheme: ThemeMode = themeMode === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setThemeMode(nextTheme);
  };

  // Don't show header on login page
  if (isLoginPage) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg text-gray-900 dark:text-slate-100 leading-tight">
                Airport Security
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight">
                Admin Control System
              </p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-base text-gray-900 dark:text-slate-100 leading-tight">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate("/admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${location.pathname === "/admin"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/admin/verification")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${location.pathname === "/admin/verification"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
            >
              <ScanEye className="w-4 h-4" />
              <span>Verify Traveler</span>
            </button>
            <button
              onClick={() => navigate("/admin/logs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${location.pathname === "/admin/logs"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
            >
              <History className="w-4 h-4" />
              <span>Logs</span>
            </button>

            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-slate-700 flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${location.pathname === "/admin/profile"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                  }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                aria-label="Toggle dark mode"
              >
                {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle dark mode"
            >
              {themeMode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-slate-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/admin");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${location.pathname === "/admin"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/verification");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${location.pathname === "/admin/verification"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
              >
                <ScanEye className="w-5 h-5" />
                <span>Verify Traveler</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/logs");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${location.pathname === "/admin/logs"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
              >
                <History className="w-5 h-5" />
                <span>Logs</span>
              </button>

              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition w-full ${location.pathname === "/admin/profile"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}