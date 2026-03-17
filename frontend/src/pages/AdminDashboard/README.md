# WomenCo Admin Dashboard

A modern, responsive admin dashboard for the WomenCo women community platform built with React and Tailwind CSS.

## Features

✅ **Responsive Sidebar Navigation** - Easy access to all admin functions
✅ **Modern Top Navbar** - Search, notifications, and user profile
✅ **Statistics Cards** - Key metrics at a glance with trend indicators
✅ **Analytics Chart** - Visual representation of member growth
✅ **Member Management Table** - View, edit, and manage all community members
✅ **Tailwind CSS Styling** - Clean, modern SaaS design
✅ **Dummy Data Included** - Ready to test and integrate with real data

## Folder Structure

```
AdminDashboard/
├── index.jsx              # Main dashboard component
├── components/
│   ├── Sidebar.jsx        # Left sidebar navigation
│   ├── Navbar.jsx         # Top navigation bar
│   ├── StatCard.jsx       # Statistics card component
│   ├── ChartSection.jsx   # Analytics chart section
│   ├── MembersTable.jsx   # Members data table
│   └── index.js           # Component exports
└── README.md              # This file
```

## Component Details

### Sidebar
- Navigation menu with 7 main items
- Color-coded active states
- Logout functionality
- Fixed positioning for easy access

### Navbar
- Sticky header with page title
- Search functionality
- Notification badge with counter
- Admin profile information

### StatCard
- Displays key metrics
- Includes trend indicators (up/down)
- Gradient backgrounds
- Hover effects for interactivity

### ChartSection
- Visual bar chart of member growth
- Monthly statistics
- Growth analytics
- Peak month indicators

### MembersTable
- 5 columns: Profile, Name, Phone, Village, Joined Date, Status, Actions
- Dummy data for 5 members
- Edit & Delete action buttons
- Status badges (Active/Pending)
- Sortable by date, name, or status
- Pagination footer

## Statistics displayed

1. **Total Members** - 1,245
2. **Active Members** - 1,089
3. **New Members This Month** - 156
4. **Community Activities** - 487

## Usage

### Import the Dashboard
```javascript
import AdminDashboard from './pages/AdminDashboard';
```

### Add to Routes
```javascript
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

## Customization

### Add Real Data
Replace dummy data in components with API calls:

```javascript
const [members, setMembers] = useState([]);

useEffect(() => {
  // Fetch from API
  axios.get('/api/members').then(res => setMembers(res.data));
}, []);
```

### Modify Sidebar Menu
Update the `menuItems` array in `Sidebar.jsx` to add/remove menu items.

### Change Color Scheme
Replace pink (`pink-500`, `pink-600`) with your preferred colors throughout the components.

## Color Palette

- **Primary**: Pink (`from-pink-500 to-pink-600`)
- **Success**: Green (`from-green-500 to-green-600`)
- **Info**: Blue (`from-blue-500 to-blue-600`)
- **Warning**: Yellow (`from-yellow-500 to-yellow-600`)
- **Danger**: Red (`bg-red-500`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Requirements

- React 16.8+ (for hooks)
- Tailwind CSS 3.0+
- React Router for navigation

## Future Enhancements

- [ ] Integrate with real API endpoints
- [ ] Add member CRUD operations
- [ ] Implement advanced filtering
- [ ] Add export to CSV/PDF functionality
- [ ] Real-time data updates
- [ ] Role-based access control
- [ ] Activity logs and audit trails
- [ ] Advanced analytics and reporting

## License

WomenCo Admin Dashboard - All rights reserved
