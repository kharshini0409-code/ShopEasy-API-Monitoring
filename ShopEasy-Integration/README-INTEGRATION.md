# ShopEasy + API Monitoring Integration

This bundle contains the original ShopEasy frontend, the existing API Monitoring project, and a new ShopEasy Spring Boot integration backend.

## What this integration does

- Preserves the existing ShopEasy HTML/CSS/JavaScript pages and their localStorage-based behavior.
- Adds a browser integration bridge that mirrors customer/product/cart/wishlist/order/review/session snapshots to the ShopEasy backend whenever the existing app writes those localStorage keys.
- Sends page-view and snapshot requests through the existing API Monitoring Gateway, so the gateway records HTTP method, status code, response time, failures, and Redis rate-limit rejections.
- Stores the latest snapshot for each supported resource and an audit event history in PostgreSQL.
- Extends the existing gateway to forward the full URL path, query string, request method, and relevant headers to the target backend.
- Redacts fields whose names contain `password`, `secret`, or `token` before mirroring customer/session data.

**Important architecture note:** ShopEasy's current frontend still uses localStorage as its working client-side store. This integration mirrors its changes to PostgreSQL and routes those mirror requests through the monitoring gateway. It is a practical monitoring integration that preserves the completed frontend; it is not yet a complete migration to normalized server-authoritative commerce tables or production authentication/payment processing.

## Requirements

- Java 21
- PostgreSQL running locally
- Redis running locally
- Node.js (for the React monitoring dashboard)
- Maven wrapper is included for the Java projects
- VS Code Live Server or another static server for ShopEasy

## 1. Configure PostgreSQL credentials

The monitoring project's `application.properties` and the new ShopEasy backend use environment variables. Set `DB_PASSWORD`, `JWT_SECRET`, and `SHOPEASY_DB_PASSWORD` in your terminal/session. `JWT_SECRET` must be a Base64-encoded key with at least 32 decoded bytes.

PowerShell example (replace the values with your local credentials):

```powershell
$env:DB_PASSWORD = "YOUR_POSTGRES_PASSWORD"
$env:SHOPEASY_DB_PASSWORD = "YOUR_POSTGRES_PASSWORD"
$env:JWT_SECRET = "YOUR_BASE64_ENCODED_SECRET"
```

The default database URL is `jdbc:postgresql://localhost:5432/api-monitor`. Create the `api-monitor` database if it does not already exist. Both Spring Boot applications use this database but create separate tables.

## 2. Start Redis

Start your local Redis server on `localhost:6379`. The existing API Monitoring application uses Redis for its rate limiter.

## 3. Start ShopEasy backend (port 8081)

Open a terminal in `ShopEasyBackend`:

```powershell
cd ShopEasyBackend
./mvnw.cmd spring-boot:run
```

If using Command Prompt, run `mvnw.cmd spring-boot:run`. Verify directly:

```powershell
Invoke-RestMethod http://localhost:8081/api/integration/health
```

Expected status is `UP`.

## 4. Start API Monitoring backend (port 8080)

Open another terminal:

```powershell
cd APIMonitoringSystem\api-monitor
.\mvnw.cmd spring-boot:run
```

The existing application should connect to PostgreSQL and Redis.

## 5. Register ShopEasy as a monitored API

Create a monitored API with target URL `http://localhost:8081`. You can use the existing monitoring UI or PowerShell:

```powershell
$body = @{
  name = "ShopEasy Backend"
  targetUrl = "http://localhost:8081"
  description = "ShopEasy browser data sync and integration events"
} | ConvertTo-Json

$result = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/monitored-apis" -ContentType "application/json" -Body $body
$result
```

Copy the returned `id`.

## 6. Set the monitored API ID in ShopEasy

Open `ShopEasyWebsite/js/integration-config.js` and replace `API_ID: 0` with the ID returned in step 5. Example only:

```javascript
API_ID: 4
```

Use the actual ID returned by your database; do not assume the example ID.

## 7. Start the monitoring dashboard

Open another terminal:

```powershell
cd APIMonitoringSystem\frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 8. Start ShopEasy

Open the `ShopEasyWebsite` folder in VS Code and start Live Server on port 5500. Open `role-selection.html` or `index.html`.

Use ShopEasy normally. Customer registration/login, product/admin changes, cart, wishlist, orders, reviews and session changes that write the mapped localStorage keys will be mirrored through the gateway.

## 9. Verify end-to-end monitoring

1. Open the ShopEasy site and navigate between pages.
2. Register a test customer or add an item to the cart.
3. Place a test order (the existing demo payment flow remains a demo).
4. Open the monitoring dashboard and select the `ShopEasy Backend` monitored API.
5. Confirm total requests, successful requests, failures and average response time increase.
6. Check stored events directly:

```powershell
Invoke-RestMethod http://localhost:8080/gateway/ACTUAL_API_ID/api/integration/events
```

Replace `ACTUAL_API_ID` with the ID registered in step 5. The above request itself also passes through the gateway and is counted.

Direct backend health check:

```powershell
Invoke-RestMethod http://localhost:8081/api/integration/health
```

Gateway health check:

```powershell
Invoke-RestMethod http://localhost:8080/gateway/ACTUAL_API_ID/api/integration/health
```

## Rate limiting

The existing `RateLimitService` allows 10 requests per 60-second window for each monitored API + client IP. A burst above that limit should return HTTP 429 and be recorded as a failed metric. Because the existing application has a deliberately low demo threshold, avoid repeatedly refreshing the ShopEasy pages while testing normal flows.

## Notes

- The gateway's current Redis limit is shared by all calls using the same monitored API ID and client IP.
- Customer password-like fields are redacted before snapshot synchronization. Existing localStorage behavior is otherwise unchanged.
- Do not commit real database passwords or JWT secrets. Use environment variables and rotate any credentials that have previously been committed or shared.
- Demo UPI QR is not a real payment gateway; do not enter real payment credentials.
