import React, { useState } from 'react';

const MembersTable = ({ members = [] }) => {
  const [sortBy, setSortBy] = useState('joinedDate');

  const dummyMembers = [
    {
      id: 1,
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      village: 'Pune',
      joinedDate: '2026-01-15',
      status: 'Active',
      avatar: 'PS',
    },
    {
      id: 2,
      name: 'Amrita Singh',
      phone: '+91 98765 43211',
      village: 'Nashik',
      joinedDate: '2026-02-10',
      status: 'Active',
      avatar: 'AS',
    },
    {
      id: 3,
      name: 'Sneha Patel',
      phone: '+91 98765 43212',
      village: 'Aurangabad',
      joinedDate: '2026-02-20',
      status: 'Pending',
      avatar: 'SP',
    },
    {
      id: 4,
      name: 'Divya Gupta',
      phone: '+91 98765 43213',
      village: 'Solapur',
      joinedDate: '2026-03-01',
      status: 'Active',
      avatar: 'DG',
    },
    {
      id: 5,
      name: 'Meera Desai',
      phone: '+91 98765 43214',
      village: 'Kolhapur',
      joinedDate: '2026-03-05',
      status: 'Active',
      avatar: 'MD',
    },
  ];

  const displayMembers = members.length > 0 ? members : dummyMembers;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Recent Members</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm focus:outline-none"
        >
          <option value="joinedDate">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Profile</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Village</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayMembers.map((member, index) => (
              <tr key={member.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-pink-50 transition-colors`}>
                <td className="px-6 py-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {member.avatar}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{member.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{member.village}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(member.joinedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                      ✏️ Edit
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <p className="text-sm text-gray-600">Showing {displayMembers.length} members</p>
        <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
          View All Members
        </button>
      </div>
    </div>
  );
};

export default MembersTable;
