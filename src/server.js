import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { logger } from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import router from './routes/index.js';
import flash from 'connect-flash';
import session from 'express-session';
import { exec } from 'child_process'; // ← 追加

//  configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Load env variables
dotenv.config();

// Get directory path for ES module
const __filename = fileURLToPath(import.meta.url);
const __rootDir = path.dirname(__filename);

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__rootDir, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__rootDir, 'public')));

// Flash messages
app.use(flash());

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

// Routes
app.use('/api', router);

// Function to start the server
const startServer = () => {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });

  // Handle errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`❌ Port ${PORT} is already in use. Killing process and retrying...`);

      // Kill the process using the port and restart
      exec(`lsof -t -i:${PORT}`, (error, stdout) => {
        if (!error && stdout) {
          const pid = stdout.trim();
          exec(`kill -9 ${pid}`, () => {
            logger.info(`✅ Killed process using port ${PORT}. Restarting server...`);
            setTimeout(startServer, 1000);
          });
        } else {
          logger.error(`❌ Unable to free port ${PORT}. Exiting.`);
          process.exit(1);
        }
      });
    } else {
      logger.error(`❌ Server error:`, err);
    }
  });
};

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fulstack_todo_app_ejs');

    logger.info(`✅ Connected to MongoDB at ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fulstack_todo_app_ejs'}`);
    
    startServer();
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start connection
connectDB();
