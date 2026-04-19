# Architecture

```text
Users
  |
  v
[CDN + WAF + TLS]
  |
  +--> [Frontend (Nginx, React static assets)]
  |
  +--> [Load Balancer]
          |
          v
      [Backend API Pods]
          |
          +--> [PostgreSQL Primary]
          |
          +--> [PostgreSQL Read Replica / DR Region]

Observability:
[Prometheus] <--scrape-- [Backend /metrics]
[Grafana] --> [Prometheus datasource]
[Alertmanager/email/Slack] <-- [Prometheus alerts]
```

## Components

- **Frontend**: Vite-built React assets served by Nginx.
- **Backend**: Express API with security middleware, rate limiting, CSRF protection, and logging.
- **Database**: PostgreSQL with indexes, backups, and PITR.
- **Monitoring**: Prometheus + Grafana + alert rules.

## Reliability patterns

- Health endpoints (`/api/live`, `/api/ready`, `/api/health`).
- Stateless backend replicas behind LB.
- Environment-specific rate-limit controls.
- Region failover playbook and backup testing.
