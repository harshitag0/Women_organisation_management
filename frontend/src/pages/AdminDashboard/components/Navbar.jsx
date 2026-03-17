import React, { useState } from 'react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="ml-64 px-8 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search members, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
            />
          </div>

          {/* Notification Icon */}
          <div className="relative cursor-pointer">
            <button className="relative text-gray-600 hover:text-pink-600 transition-colors">
              <span className="text-2xl">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Priya Admin</p>
              <p className="text-xs text-gray-500">Platform Admin</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              PA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
