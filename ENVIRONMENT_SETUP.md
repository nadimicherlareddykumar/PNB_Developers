# Environment Setup

## Development

- `NODE_ENV=development`
- Local PostgreSQL via `docker-compose.yml`
- Relaxed rate limits (`RATE_LIMIT_AUTH_MAX=100`, `RATE_LIMIT_API_MAX=1000`)

## Staging

- `NODE_ENV=staging`
- Managed PostgreSQL staging instance
- Staging domains and certificates
- Suggested limits: `RATE_LIMIT_AUTH_MAX=20`, `RATE_LIMIT_API_MAX=500`

## Production

- `NODE_ENV=production`
- Managed PostgreSQL with HA + PITR
- Secret manager for JWT/SMTP credentials
- Suggested limits: `RATE_LIMIT_AUTH_MAX=8`, `RATE_LIMIT_API_MAX=200`

## Required backend variables

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (if email notifications enabled)
- `RATE_LIMIT_WINDOW_MINUTES` (optional)
- `RATE_LIMIT_AUTH_MAX` (optional)
- `RATE_LIMIT_API_MAX` (optional)

## Frontend variables

At build-time, set `VITE_*` variables as required by the client (API URL, environment labels).

## Security notes

- Never commit `.env` files.
- Rotate secrets regularly.
- Use separate credentials per environment.
