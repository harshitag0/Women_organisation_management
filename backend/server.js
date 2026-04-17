const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
// NOTE: The cors package does NOT support glob patterns like 'https://*.vercel.app'
// We use a function to dynamically allow localhost, our Vercel app, and any Vercel preview URL
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://krantijyotifoundation.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow exact matches
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Allow any *.vercel.app preview deployment
    if (/^https:\/\/[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin) ||
        /^https:\/\/.+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'No origin'}`);
  next();
});

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const loanRoutes = require('./routes/loanRoutes');
const miscRoutes = require('./routes/miscRoutes');
const memberRoutes = require('./routes/memberRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Listen to routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/payment', paymentRoutes);
// Mount miscRoutes LAST so /api/members, /api/orders etc. are not swallowed
app.use('/api', miscRoutes); // Handles /api/events, /api/savings, /api/stats, /api/feedback

// Basic Route
app.get('/', (req, res) => {
  res.send('Bachatgat API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`CORS enabled for: ${ALLOWED_ORIGINS.join(', ')} + *.vercel.app`);
});
