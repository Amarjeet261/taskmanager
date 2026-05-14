import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, Zap } from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout?.();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-400/40">
            <Zap className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          </div>

          <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
            Task Manager
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Settings Button */}
          <button
            onClick={() => navigate("/profile")}
            className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-full transition"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-purple-50 border border-transparent hover:border-purple-200 transition"
            >
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full shadow"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 text-white font-semibold shadow">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
              </div>

              {/* User Info */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <ul className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </button>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>

              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


export default Navbar;