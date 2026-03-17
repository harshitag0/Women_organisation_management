# WomenCo Admin Dashboard - Developer Guide

## 🚀 Quick Reference for Developers

### How to Add a New Sidebar Menu Item

**File**: `components/Sidebar.jsx`

```javascript
// Find the menuItems array and add your item:
const menuItems = [
  // ... existing items
  { icon: '📧', label: 'Email Campaigns', id: 'EmailCampaigns' },
];
```

### How to Handle Menu Click Navigation

**File**: `components/Sidebar.jsx`

```javascript
// Update the onClick handler in the button:
const handleMenuClick = (menuId) => {
  setActiveMenu(menuId);
  // Add navigation logic:
  // navigate(`/admin/${menuId.toLowerCase()}`);
};
```

### How to Update Admin Profile Info

**File**: `components/Navbar.jsx`

```javascript
// Replace the hardcoded values:
<p className="text-sm font-semibold text-gray-800">Your Name</p>
<p className="text-xs text-gray-500">Your Role</p>
<div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
  YOUR_INITIALS
</div>
```

### How to Connect to Real API Data

**File**: `AdminDashboard/index.jsx`

```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, membersRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/members'),
        ]);
        setStats(statsRes.data);
        setMembers(membersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // ... rest of component
  );
};
```

### How to Add Real Member Data to Table

**File**: `components/MembersTable.jsx`

```javascript
// Option 1: Accept members as props
const MembersTable = ({ members = [] }) => {
  const displayMembers = members.length > 0 ? members : dummyMembers;
  
  return (
    // ... table rendering
  );
};

// Option 2: Fetch inside component
import { useEffect, useState } from 'react';

const [members, setMembers] = useState([]);

useEffect(() => {
  axios.get('/api/members').then(res => setMembers(res.data));
}, []);
```

### How to Implement Edit Member Function

**File**: `components/MembersTable.jsx`

```javascript
const handleEdit = (memberId) => {
  // Navigate to edit page or open modal
  // navigate(`/admin/members/${memberId}`);
  
  // Or open modal:
  // setEditModalOpen(true);
  // setSelectedMember(memberId);
};

// Update the button:
<button 
  onClick={() => handleEdit(member.id)}
  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg..."
>
  ✏️ Edit
</button>
```

### How to Implement Delete Member Function

**File**: `components/MembersTable.jsx`

```javascript
const handleDelete = async (memberId) => {
  if (window.confirm('Are you sure you want to delete this member?')) {
    try {
      await axios.delete(`/api/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
      // Show success toast
    } catch (error) {
      // Show error toast
      console.error('Error deleting member:', error);
    }
  }
};

// Update the button:
<button 
  onClick={() => handleDelete(member.id)}
  className="px-3 py-1 bg-red-100 text-red-600 rounded-lg..."
>
  🗑️ Delete
</button>
```

### How to Change Color Theme

**Global Change** - Replace all color references:

```javascript
// Old colors:
// pink-500, pink-600, bg-pink-*

// New colors (example: Purple):
// purple-500, purple-600, bg-purple-*
```

**In Sidebar.jsx**:
```javascript
// Change:
className="w-64 bg-gradient-to-b from-pink-600 to-pink-700..."
// To:
className="w-64 bg-gradient-to-b from-purple-600 to-purple-700..."
```

**In StatCard.jsx**:
```javascript
// Update stat card color:
{ bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600' }
```

### How to Add New Statistics Card

**File**: `AdminDashboard/index.jsx`

```javascript
const stats = [
  // ... existing stats
  {
    title: 'Total Revenue',
    value: '₹45,600',
    icon: '💰',
    bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    trend: 'up',
    trendValue: '15.3%',
  },
];
```

### How to Modify Chart Data

**File**: `components/ChartSection.jsx`

```javascript
const monthlyData = [
  { month: 'Jan', members: 45, percentage: 45 },
  { month: 'Feb', members: 72, percentage: 72 },
  { month: 'Mar', members: 98, percentage: 98 },
  // Add more months:
  { month: 'Apr', members: 125, percentage: 125 },
];
```

### How to Add Notification Badge Count

**File**: `components/Navbar.jsx`

```javascript
// Update state:
const [notifications, setNotifications] = useState(3);

// Refresh notifications:
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await axios.get('/api/admin/notifications/count');
    setNotifications(res.data.count);
  }, 60000); // Every minute
  
  return () => clearInterval(interval);
}, []);
```

### How to Search/Filter Members

**File**: `components/MembersTable.jsx`

```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredMembers = displayMembers.filter(member =>
  member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.phone.includes(searchTerm) ||
  member.village.toLowerCase().includes(searchTerm.toLowerCase())
);

// Add search input:
<input 
  type="text"
  placeholder="Search members..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="px-3 py-2 border rounded-lg..."
/>

// Use filteredMembers in table rendering
```

### How to Add Pagination

**File**: `components/MembersTable.jsx`

```javascript
const [currentPage, setCurrentPage] = useState(1);
const membersPerPage = 10;

const indexOfLastMember = currentPage * membersPerPage;
const indexOfFirstMember = indexOfLastMember - membersPerPage;
const currentMembers = displayMembers.slice(indexOfFirstMember, indexOfLastMember);

const totalPages = Math.ceil(displayMembers.length / membersPerPage);

// Add pagination UI:
<div className="flex justify-between items-center">
  <button 
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button 
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
```

### How to Add Loading States

**File**: `AdminDashboard/index.jsx`

```javascript
import { useState } from 'react';

const [loading, setLoading] = useState(true);

// Show loading spinner:
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  );
}
```

### How to Add Toast Notifications

```javascript
// Install: npm install react-toastify

import { toast } from 'react-toastify';

// Use in handlers:
const handleSuccess = () => {
  toast.success('Member updated successfully!');
};

const handleError = () => {
  toast.error('Error updating member!');
};
```

### How to Make Sidebar Responsive for Mobile

**File**: `components/Sidebar.jsx`

```javascript
const [sidebarOpen, setSidebarOpen] = useState(false);

// Update classes:
className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 transition-all...`}

// Add toggle button in Navbar for mobile
```

### How to Add Dark Mode

**File**: `AdminDashboard/index.jsx`

```javascript
const [darkMode, setDarkMode] = useState(false);

// Add toggle button in Navbar:
<button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? '☀️' : '🌙'}
</button>

// Apply to Sidebar and other elements:
className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}...`}
```

## Common Issues & Solutions

### Issue: Colors not applying
**Solution**: Make sure Tailwind CSS is configured in your project

### Issue: Sidebar overlapping content
**Solution**: Ensure `ml-64` class is applied to main content div

### Issue: Table data not showing
**Solution**: Check if dummy data or props are properly passed

### Issue: Navigation not working
**Solution**: Implement `navigate` from `useNavigate()` hook

### Issue: Search not filtering
**Solution**: Check string comparison logic (use `.toLowerCase()`)

## Performance Tips

1. **Memoize components** to avoid unnecessary re-renders:
```javascript
export default React.memo(StatCard);
```

2. **Use useCallback** for event handlers:
```javascript
const handleEdit = useCallback((id) => {
  // handler logic
}, []);
```

3. **Lazy load** the dashboard:
```javascript
const AdminDashboard = lazy(() => import('./AdminDashboard'));
```

## Testing Examples

```javascript
// Test Sidebar menu items render
test('renders all menu items', () => {
  render(<Sidebar />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Members')).toBeInTheDocument();
});

// Test logout button
test('logout button navigates to login', () => {
  render(<Sidebar />);
  fireEvent.click(screen.getByText('Logout'));
  expect(window.location.pathname).toBe('/login');
});
```

---

**Version**: 1.0
**Last Updated**: March 11, 2026
**Difficulty**: Beginner to Intermediate
