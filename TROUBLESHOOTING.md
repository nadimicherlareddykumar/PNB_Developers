# Troubleshooting

## API container unhealthy

- Check `/api/live` first.
- If `/api/live` works and `/api/ready` fails, check database connectivity and credentials.
- Verify `DATABASE_URL`, network rules, and SSL requirements.

## CSRF token errors (403)

- Confirm frontend sends cookies and the latest `x-csrf-token` header.
- Validate `CORS_ORIGIN` exactly matches frontend host.

## Rate limiting too aggressive

- Tune `RATE_LIMIT_AUTH_MAX`, `RATE_LIMIT_API_MAX`, and `RATE_LIMIT_WINDOW_MINUTES` per environment.

## Prometheus scrape failing

- Confirm `/metrics` endpoint is reachable from Prometheus.
- Verify scrape target and port in `monitoring/prometheus.yml`.

## Frontend routing 404s

- Ensure Nginx uses `try_files $uri $uri/ /index.html;` (configured in `Dockerfile.client`).

## Slow responses

- Check Grafana latency panels and DB saturation.
- Scale API replicas and review expensive database queries.
