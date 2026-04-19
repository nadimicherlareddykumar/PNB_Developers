# Rollback Procedure

## Trigger conditions

- Elevated 5xx rates
- Readiness failures after deploy
- Significant latency regression

## Steps

1. Freeze further deployments.
2. Roll back backend image to previous known-good tag.
3. Roll back frontend image/CDN origin tag.
4. Verify health endpoints and key user journeys.
5. Keep database schema backward compatible whenever possible.

## Database rollback policy

- Prefer forward-fix migrations.
- If emergency rollback is required:
  - Restore from latest verified snapshot/PITR point.
  - Validate data consistency in staging first when possible.

## Verification checklist

- `/api/live` and `/api/ready` passing
- Error rate returned to baseline
- Dashboards and alerts stable
- Incident timeline documented
