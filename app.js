const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./src/config/config');
const routesV1 = require('./src/routes/v1');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utilities/logger');

const app = express();

// Security HTTP headers
app.use(helmet());
app.disable('x-powered-by');

// CORS configuration supporting production and local frontend origins
const rawOrigins = config.corsOrigin || '*';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(normalizedOrigin) ||
        config.env === 'development'
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message) => logger.info(`"http","request","${message.trim()}"`)
    }
  })
);

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests created from this IP, please try again after 15 minutes'
    }
  }
});
app.use('/api/', limiter);

// Root greeting / health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Taskify Mindful Personal Task Tracking API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// API Routes
app.use('/api/v1', routesV1);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
