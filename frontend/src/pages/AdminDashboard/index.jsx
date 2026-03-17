import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import ChartSection from './components/ChartSection';
import MembersTable from './components/MembersTable';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Members',
      value: '1,245',
      icon: '👥',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'up',
      trendValue: '12.5%',
    },
    {
      title: 'Active Members',
      value: '1,089',
      icon: '✅',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: 'up',
      trendValue: '8.2%',
    },
    {
      title: 'New This Month',
      value: '156',
      icon: '🆕',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      trend: 'up',
      trendValue: '23.1%',
    },
    {
      title: 'Community Activities',
      value: '487',
      icon: '🎯',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: 'down',
      trendValue: '3.4%',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <div className="p-8">
          {/* Statistics Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  bgColor={stat.bgColor}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
                />
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mb-8">
            <ChartSection />
          </div>

          {/* Recent Members Table */}
          <div>
            <MembersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
