# ShopEasy + API Monitoring

Start with `README-INTEGRATION.md` for the complete setup sequence.

Included folders:
- `ShopEasyWebsite/` — original ShopEasy pages, styles and scripts, plus `js/integration-config.js` and `js/integration.js`.
- `APIMonitoringSystem/api-monitor/` — existing Spring Boot monitor with the gateway updated to proxy endpoint paths, query strings, methods and headers.
- `APIMonitoringSystem/frontend/` — existing React monitoring dashboard source (dependencies are intentionally excluded; run `npm install`).
- `ShopEasyBackend/` — new Spring Boot service that stores ShopEasy data snapshots and integration events in PostgreSQL.

Read `README-INTEGRATION.md` before running. Set local environment variables and register the ShopEasy backend as a monitored API before entering its returned ID in `ShopEasyWebsite/js/integration-config.js`.
