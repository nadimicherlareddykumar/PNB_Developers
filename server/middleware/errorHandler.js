import logger from '../utils/logger.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    status,
    message: error.message
  });

  if (res.headersSent) {
    return next(error);
  }

  const clientMessage = status >= 500
    ? 'Server error'
    : status === 404
      ? 'Not found'
      : 'Request failed';
  res.status(status).json({ error: clientMessage });
};
