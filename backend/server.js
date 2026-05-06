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
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://sharda-foundation.vercel.app',
  'https://krantijyotifoundation.vercel.app',
  'https://sakhiconnect.tech',           // Custom domain
  'https://www.sakhiconnect.tech',       // www variant
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    if (/^https:\/\/.+\.vercel\.app$/.test(origin)) return callback(null, true);
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

const authRoutes         = require('./routes/authRoutes');
const productRoutes      = require('./routes/productRoutes');
const orderRoutes        = require('./routes/orderRoutes');
const loanRoutes         = require('./routes/loanRoutes');
const miscRoutes         = require('./routes/miscRoutes');
const memberRoutes       = require('./routes/memberRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');

// Listen to routes
app.use('/api/auth',          authRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/loans',         loanRoutes);
app.use('/api/members',       memberRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/payment',       paymentRoutes);
app.use('/api',               miscRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Bachatgat API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`CORS enabled for: ${ALLOWED_ORIGINS.join(', ')} + *.vercel.app`);

  // ── Auto-seed admin on every startup ──────────────────────────────
  // Ensures admin exists in BOTH local and production MongoDB
  try {
    const User = require('./models/User');
    const existing = await User.findOne({ role: 'Admin' });
    if (!existing) {
      await User.create({
        username: 'harshita',
        password: '11111',          // plain text — pre-save hook hashes it
        role:     'Admin',
        name:     'Harshita (Admin)',
        email:    'harshita@admin.com',
      });
      console.log('✅ Admin user auto-created: harshita / 11111');
    } else {
      console.log(`ℹ️  Admin already exists: ${existing.username}`);
    }
  } catch (e) {
    console.error('⚠️  Admin seed error:', e.message);
  }
  // ──────────────────────────────────────────────────────────────────
});

