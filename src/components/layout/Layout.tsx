import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { currentConfig } from "../../constants/courierConfig";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Package,
} from "lucide-react";

import { useOwnerMode } from "../../context/OwnerModeContext";
import { ThemeToggle } from "../ui/ThemeToggle";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutOwnerMode } = useOwnerMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logoutOwnerMode();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dashboard_filters");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/form", label: "New Shipment", icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 px-4 py-3 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-lg">
            <Package className="h-5 w-5 text-primary dark:text-blue-400" />
          </div>
          <span className="font-bold text-lg text-gray-800 dark:text-white">
            {currentConfig.displayName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl">
            <Package className="h-8 w-8 text-primary dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {currentConfig.displayName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              {currentConfig.tagline}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 font-semibold shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-primary dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 m-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
