# Deployment Guide

This guide covers production deployment for the PNB Developers portal (React frontend + Node.js API + PostgreSQL).

## 1) Prerequisites

- Docker 24+
- Kubernetes 1.28+ (or ECS equivalent)
- Managed PostgreSQL (with backups enabled)
- DNS + TLS certificates
- Container registry (GHCR or ECR)

## 2) Build and publish images

```bash
docker build -t ghcr.io/<org>/pnb-backend:<tag> -f Dockerfile .
docker build -t ghcr.io/<org>/pnb-client:<tag> -f Dockerfile.client .
docker push ghcr.io/<org>/pnb-backend:<tag>
docker push ghcr.io/<org>/pnb-client:<tag>
```

## 3) Required runtime environment variables

Backend:
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://...`
- `JWT_SECRET=<strong-secret-from-secret-store>`
- `CORS_ORIGIN=https://app.example.com`
- `RATE_LIMIT_AUTH_MAX=8`
- `RATE_LIMIT_API_MAX=200`

## 4) Production deployment sequence

1. Deploy database (multi-AZ, PITR enabled).
2. Run schema initialization (automatic at startup).
3. Deploy backend service with at least 2 replicas.
4. Deploy frontend behind CDN.
5. Configure load balancer health checks:
   - Backend liveness: `GET /api/live`
   - Backend readiness: `GET /api/ready`
   - Frontend health: `GET /healthz`
6. Configure Prometheus scrape of `/metrics`.
7. Enable alerts and dashboards.

## 5) Networking and security

- Enforce TLS 1.2+ at load balancer.
- Redirect HTTP to HTTPS.
- Keep secrets in platform secret manager only.
- Restrict DB access to app subnet/security groups.
- Enable WAF and per-IP rate limiting at edge.

## 6) CDN and static assets

- Serve frontend through CDN (CloudFront/Cloudflare/Azure CDN).
- Cache static assets aggressively (`Cache-Control: public, max-age=31536000, immutable`).
- Keep HTML cache short (`max-age=60`) for fast rollouts.

## 7) Auto-scaling

- Backend: scale on CPU (>65%), memory (>75%), and request rate.
- Frontend: scale by edge/platform defaults.
- Minimum 2 replicas in each active region.

## 8) Multi-region strategy

- Active-passive minimum: secondary region warm standby.
- Database replication/read replicas in secondary region.
- Failover runbook with DNS switch and smoke tests.

## 9) Backup and restore

- Enable daily full backup + WAL/PITR.
- Weekly restore test in non-production.
- Keep 30+ days retention for production.

## 10) Post-deploy verification

```bash
curl -f https://api.example.com/api/live
curl -f https://api.example.com/api/ready
curl -f https://api.example.com/api/health
curl -f https://api.example.com/metrics
curl -f https://app.example.com/healthz
```
