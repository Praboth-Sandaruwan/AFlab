# AFlab — Personal Finance Tracker Backend

AFlab is a Node.js/Express backend for a personal finance tracking system providing user authentication, transaction management, budgets, goals, currency exchange, PDF reporting, real‑time notifications, and operational metrics.

Core entry points:
- App bootstrap: [backend/index.js](backend/index.js)
- HTTP and WebSocket server: [backend/server.js](backend/server.js)
- OpenAPI spec: [backend/swagger.yaml](backend/swagger.yaml)

Base URLs
- API base: http://localhost:5000
- API docs (Swagger UI): http://localhost:5000/api-docs

Features
- JWT authentication with role support via [generateToken()](backend/middleware/generateToken.js:3) and [generateUserToken()](backend/middleware/generateToken.js:9), enforced by [authMiddleware](backend/middleware/authMiddleware.js:3).
- Transactions CRUD, tagging, and admin views (see Swagger paths under /api/transactions).
- Budgets CRUD and admin views (see Swagger paths under /api/budgets).
- Personal goals management and admin operations (see Swagger paths under /api/goals).
- Currency exchange endpoint at /api/currencyEx powered by [getExchangeRate()](backend/index.js:28).
- Monthly PDF report generation using Puppeteer via [generateMonthlyReport()](backend/controllers/reportController.js:4).
- Real‑time notifications over Socket.IO: server wiring [io.on()](backend/server.js:23), client example [backend/client.js](backend/client.js).
- Prometheus metrics exposed at /metrics implemented by [app.get('/metrics')](backend/server.js:37).

Tech Stack
- Node.js, Express, Socket.IO
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Swagger UI (OpenAPI 3.0 in [backend/swagger.yaml](backend/swagger.yaml))
- Puppeteer for PDF generation
- prom-client for metrics
- Jest + Supertest for tests

Architecture Overview
- Configuration and DB: [connectDB()](backend/config/db.js:3) uses MONGO_URI; environment is loaded in [dotenv.config()](backend/index.js:20).
- HTTP routing is registered in [app.use()](backend/index.js:27), mounting feature routers under /api/*.
- The HTTP server and WebSocket broker are created in [server.listen()](backend/server.js:33) with Socket.IO initialized and injected via [setSocketIo()](backend/middleware/notificationMiddleware.js).
- Swagger UI is configured from [YAML.load()](backend/index.js:7) and served at /api-docs.

Directory Structure
- [backend/](backend) — Express application and tests
  - [config/](backend/config) — DB connection
  - [controllers/](backend/controllers) — Feature controllers
  - [middleware/](backend/middleware) — Auth, metrics, notifications
  - [models/](backend/models) — Mongoose schemas
  - [routes/](backend/routes) — API route modules
  - [__tests__/](backend/__tests__) — Jest test suites
- [security report/](security report) — OWASP ZAP HTML report

Prerequisites
- Node.js 18+ and npm
- MongoDB instance and connection string
- Optional: Prometheus server to scrape /metrics

Environment Variables
Create a .env file in [backend/](backend) with:
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=a-strong-secret
PORT=5000

Installation
1) Navigate to [backend/](backend) and install dependencies:
   npm install

Running the Server
- Development (with reload): npm run dev
- Production: npm start

Once running:
- HTTP server: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs
- Metrics: http://localhost:5000/metrics

Authentication
- Use Bearer tokens in the Authorization header: "Authorization: Bearer <jwt>".
- Register a user: POST /api/auth/register (see Swagger).
- Login (user): POST /api/auth/login returns JWT.
- Admin registration: POST /api/auth/register/admin.
- Admin login: POST /api/auth/login/admin.
Tokens are signed by [generateToken()](backend/middleware/generateToken.js:3) and [generateUserToken()](backend/middleware/generateToken.js:9); verified in [authMiddleware](backend/middleware/authMiddleware.js:3).

Key Endpoints
- Transactions: /api/transactions, /api/transactions/{id}, admin: /api/transactions/all, /api/transactions/any/{id}
- Budgets: /api/budgets, /api/budgets/{id}, admin: /api/budgets/all, /api/budgets/any/{id}
- Goals: /api/goals, /api/goals/{id}, /api/goals/{id}/progress, admin: /api/goals/all, /api/goals/any/{id}
- Currency Exchange: GET /api/currencyEx?base=LKR&target=USD
- Monthly Report (PDF): GET /api/report/monthly?month=MM&year=YYYY
- Notifications: /api/notifications and /api/notifications/{id}
Full request/response schemas are in [backend/swagger.yaml](backend/swagger.yaml).

Monthly Report
- Requires authentication.
- Query params: month (MM), year (YYYY).
- Generates a downloadable PDF; implemented in [generateMonthlyReport()](backend/controllers/reportController.js:4).

Real‑Time Notifications
- Start the backend normally.
- In a second terminal under [backend/](backend), run client:
   node client.js
- Trigger notification creation via POST /api/notifications (see Swagger).
- The client logs "Received Notification: ..."; sample registration emit is in [socket.emit('register')](backend/client.js:7).

Operational Metrics
- Prometheus metrics are exported at /metrics using [prom-client](backend/server.js:37).
- Scrape target example (Prometheus):
  - job_name: 'aflab-backend'
    static_configs:
      - targets: ['localhost:5000']

Testing
- Run all unit tests: npm run test
- Run a single suite: npm test ./__tests__/<name>.test.js
- Example suites are under [backend/__tests__/](backend/__tests__).

Load Testing
- Artillery test plan: [backend/load-test.yml](backend/load-test.yml).
- Execute: npm run ptest or artillery run load-test.yml
- Observe metrics at http://localhost:5000/metrics during the test.

Security
- An OWASP ZAP report is included: open [security report/2025-03-11-ZAP-Report-localhost.html](security report/2025-03-11-ZAP-Report-localhost.html).
- Use Helmet middleware and robust JWT secrets in production.

Troubleshooting
- MongoDB connection issues: verify MONGO_URI used by [connectDB()](backend/config/db.js:5).
- Invalid Token responses: confirm Authorization header and [JWT_SECRET](backend/middleware/authMiddleware.js:13).
- Puppeteer PDF generation on restricted networks may require setting PUPPETEER_DOWNLOAD_BASE or using a system Chromium via PUPPETEER_EXECUTABLE_PATH.
- CORS issues: see [app.use(cors())](backend/server.js:10).

Contributing
- Fork the repo, create a feature branch, commit with clear messages, open a PR.
- Run tests and linting before submitting.

License
- Licensed under ISC. See [LICENSE](LICENSE).

Author
- Praboth Sandaruwan