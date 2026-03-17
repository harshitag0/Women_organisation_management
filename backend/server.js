const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const loanRoutes = require('./routes/loanRoutes');
const miscRoutes = require('./routes/miscRoutes');
const memberRoutes = require('./routes/memberRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Listen to routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api', miscRoutes); // Mounts /api/events and /api/savings
app.use('/api/members', memberRoutes);
app.use('/api/announcements', announcementRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Bachatgat API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
