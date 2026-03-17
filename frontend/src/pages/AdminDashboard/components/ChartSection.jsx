import React from 'react';

const ChartSection = () => {
  // Simple bar chart representation using CSS
  const monthlyData = [
    { month: 'Jan', members: 45, percentage: 45 },
    { month: 'Feb', members: 72, percentage: 72 },
    { month: 'Mar', members: 98, percentage: 98 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Member Growth Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">Monthly member growth over the last 3 months</p>
        </div>
        <select className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm focus:outline-none">
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-8 h-64 justify-around px-4">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full flex items-end justify-center h-48">
              <div
                className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t-lg transition-all hover:from-pink-600 hover:to-pink-500"
                style={{ height: `${data.percentage * 2}px` }}
              >
                <div className="flex items-center justify-center h-full text-white font-bold text-lg">
                  {data.percentage}%
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">{data.month}</p>
              <p className="text-sm text-gray-500">{data.members} members</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Average Growth</p>
          <p className="text-2xl font-bold text-pink-600">71.7%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Peak Month</p>
          <p className="text-2xl font-bold text-blue-600">March</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Total Added</p>
          <p className="text-2xl font-bold text-green-600">215</p>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
