# Monitoring Setup

## Components

- **Prometheus**: Scrapes backend metrics from `/metrics`
- **Grafana**: Visualizes request rate, error rate, latency, and in-flight requests
- **Alerts**: Defined in `monitoring/alerts.yml`

## Local setup

```bash
docker compose up -d backend prometheus grafana
```

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Import dashboard

1. Open Grafana.
2. Add Prometheus datasource (`http://prometheus:9090`).
3. Import `monitoring/grafana-dashboard.json`.

## Metrics exposed by API

- `pnb_http_requests_total`
- `pnb_http_request_duration_seconds`
- `pnb_http_requests_in_flight`
- Node default process/runtime metrics
