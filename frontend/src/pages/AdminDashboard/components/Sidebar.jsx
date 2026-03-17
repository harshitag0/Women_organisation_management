import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    { icon: '📊', label: 'Dashboard', id: 'Dashboard' },
    { icon: '👥', label: 'Members', id: 'Members' },
    { icon: '➕', label: 'Add Member', id: 'AddMember' },
    { icon: '🛍️', label: 'Marketplace', id: 'Marketplace' },
    { icon: '📢', label: 'Announcements', id: 'Announcements' },
    { icon: '📈', label: 'Statistics', id: 'Statistics' },
    { icon: '⚙️', label: 'Settings', id: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-pink-600 to-pink-700 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-pink-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-pink-600 font-bold text-lg">
            WC
          </div>
          <div>
            <h1 className="text-xl font-bold">WomenCo</h1>
            <p className="text-xs text-pink-100">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
              activeMenu === item.id
                ? 'bg-white text-pink-600 font-semibold shadow-lg'
                : 'text-pink-100 hover:bg-pink-500'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 absolute bottom-6 w-full px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
