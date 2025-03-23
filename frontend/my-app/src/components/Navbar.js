import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  CubeIcon,
  UserGroupIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth || {});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col shadow-lg z-10`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">
            <Link to="/">ConstructionXpert</Link>
          </h1>
        )}
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isCollapsed ? <Bars3Icon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
        </button>
      </div>

      <ul className="flex-1 flex flex-col space-y-2 p-4">
        {isAuthenticated ? (
          <>
            <li>
              <Link
                to="/"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <HomeIcon className="h-6 w-6" />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <FolderIcon className="h-6 w-6" />
                {!isCollapsed && <span>Projects</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/resources"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <CubeIcon className="h-6 w-6" />
                {!isCollapsed && <span>Resources</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/suppliers"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="h-6 w-6" />
                {!isCollapsed && <span>Suppliers</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
                {!isCollapsed && <span>Profile</span>}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-2 rounded hover:bg-red-600 transition-colors text-left"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                {!isCollapsed && <span>Logout ({user?.username})</span>}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                {!isCollapsed && <span>Login</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
                {!isCollapsed && <span>Register</span>}
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center p-2 rounded hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          {!isCollapsed && <span className="ml-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;