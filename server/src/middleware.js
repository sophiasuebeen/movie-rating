const config = require('./config');

// Validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.validated = validated;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({ error: 'Validation failed', details: messages });
      }
      return res.status(400).json({ error: 'Validation error' });
    }
  };
}

// CORS middleware
function corsMiddleware(req, res, next) {
  const allowedOrigins = config.allowedOrigins;
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (config.isDev) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: message,
    ...(config.isDev && { stack: err.stack }),
  });
}

// 404 handler
function notFoundHandler(req, res) {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  validateRequest,
  corsMiddleware,
  errorHandler,
  notFoundHandler,
};
