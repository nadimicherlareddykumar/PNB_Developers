import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register, prefix: 'pnb_' });

const httpRequestsTotal = new client.Counter({
  name: 'pnb_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'pnb_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

const httpRequestsInFlight = new client.Gauge({
  name: 'pnb_http_requests_in_flight',
  help: 'In-flight HTTP requests',
  registers: [register]
});

const resolveRouteLabel = (req) => {
  if (req.route?.path) {
    return `${req.baseUrl || ''}${req.route.path}`;
  }
  return req.baseUrl || req.path || req.originalUrl;
};

const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  httpRequestsInFlight.inc();

  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: resolveRouteLabel(req),
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);
    end(labels);
    httpRequestsInFlight.dec();
  });

  next();
};

const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

export { metricsEndpoint, metricsMiddleware };
