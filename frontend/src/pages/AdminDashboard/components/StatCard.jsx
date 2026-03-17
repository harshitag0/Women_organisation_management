import React from 'react';

const StatCard = ({ title, value, icon, bgColor, trend, trendValue }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-4xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
            </p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
