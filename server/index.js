require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://udis-ai-1.onrender.com',
    'https://udis-ai.vercel.app'
  ],
  credentials: false
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/insights', require('./routes/insightRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'UDIS API running', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));