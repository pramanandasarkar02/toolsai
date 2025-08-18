import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaSun,
  FaMoon,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaHome,
  FaRss,
  FaCompass,
  FaKeyboard,
  FaComments,
  FaBuilding,
  FaHeart,
  FaCog,
  FaChartLine,
  FaBell
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useUser();

  return (
    <nav className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border-b`}>
      {/* Logo/Brand */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-xl font-bold hover:text-blue-600 transition-colors">
          Tools AI
        </Link>
      </div>

      {/* Main Navigation - Conditionally rendered based on user role */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Home link for all users */}
        {/* <Link to="/" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
          <FaHome className="text-sm" />
          <span>Home</span>
        </Link> */}

        {/* Feed and Explore links for all users including guests */}

        <Link to="/explore" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
          <FaCompass className="text-sm" />
          <span>Explore</span>
        </Link>

        {/* Additional links for logged-in USER role */}
        {user?.role === 'USER' && (
          <>
            <Link to="/feed" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaRss className="text-sm" />
              <span>Feed</span>
            </Link>
            <Link to="/prompt" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaKeyboard className="text-sm" />
              <span>Prompt</span>
            </Link>
            <Link to="/favourite" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaHeart className="text-sm" />
              <span>Favorites</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaBell className="text-sm" />
              <span>Notifications</span>
            </Link>
          </>
        )}

        {/* Additional links for MODERATOR and ADMIN roles */}
        {(user?.role === 'MODERATOR' || user?.role === 'ADMIN') && (
          <>
            <Link to="/feed" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaRss className="text-sm" />
              <span>Feed</span>
            </Link>
            <Link to="/prompt" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaKeyboard className="text-sm" />
              <span>Prompt</span>
            </Link>
            <Link to="/favourite" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaHeart className="text-sm" />
              <span>Favorites</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaBell className="text-sm" />
              <span>Notifications</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <FaChartLine className="text-sm" />
              <span>Dashboard</span>
            </Link>
          </>
        )}


      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>

        {/* User Controls */}
        {user ? (
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <FaUser className="text-sm" />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => setUser(null)}
              className="flex items-center space-x-1 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="text-sm" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <FaSignInAlt className="text-sm" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className={`flex items-center space-x-1 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-md transition-colors`}
            >
              <FaUserPlus className="text-sm" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;