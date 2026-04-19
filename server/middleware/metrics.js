import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register, prefix: 'pnb_' });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [register]
});

const httpRequestsInFlight = new client.Gauge({
  name: 'http_requests_in_flight',
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
  const end = httpRequestDurationMs.startTimer();
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
