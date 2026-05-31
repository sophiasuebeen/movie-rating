const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  databaseUrl: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(','),
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`,
};

module.exports = config;
