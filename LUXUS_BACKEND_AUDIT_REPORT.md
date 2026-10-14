# Luxus Backend Technical Architecture & Audit Report
**Commit Reference:** `494911aba9ce39ce1e69d31d626f64f2f618d124` ("Initial commit: Luxus Backend API")  
**Specification:** `luxus-backend-fix-prompt.md`  
**Current Branch State:** `HEAD` (`3e41622` - CI/CD Integration)

---

## 1. Executive Summary

This document provides a complete technical analysis comparing the architecture, packages, and security mechanisms specified in `luxus-backend-fix-prompt.md` with the baseline commit `494911a` and current production state.

The prompt `luxus-backend-fix-prompt.md` was an exhaustive 5-phase engineering audit designed to eliminate critical security holes, fix silently broken database logic, remove code rot, and implement enterprise-grade real-time marketplace capabilities. Commit `494911a` represents the milestone where this entire 5-phase refactoring plan was consolidated into a production-ready codebase (94 files, 16,066+ lines of code).

---

## 2. Before vs. After: What Changed (Phases 1 through 5)

### Phase 1: Critical Security Hardening

| Feature / Attack Vector | Before (`luxus-backend-fix-prompt.md`) | Implemented in Commit `494911a` |
| :--- | :--- | :--- |
| **Privilege Escalation** | Clients could register with `{ "role": "admin" }` or update their profile role. | Client role input is strictly restricted to `buyer` or `seller` (default `buyer`). Admin roles can **only** be provisioned via offline CLI script (`scripts/createAdmin.js`). |
| **OAuth Registration Spoofing** | `/complete-google-signup` trusted user-supplied `email` and `role` with zero cryptographic proof. | Google callback signs a **10-minute JWT** with `GOOGLE_SIGNUP_SECRET`. The completion route derives identity **strictly** from the verified token. |
| **Mass Assignment & Ownership** | Sellers could edit any property, approve their own listings, and tamper with reviews. | Verified `property.seller.equals(req.user.id)` on mutations. Approved listings edited by sellers automatically revert to `status: 'pending'` for moderation. |
| **WebSocket Impersonation** | Sockets accepted arbitrary `senderId` and allowed public room broadcasting. | Enforced token authentication on handshake (`middlewares/socketsToken.js`). Server strictly uses `socket.user.id` and verifies conversation membership. |
| **Payment Price Tampering** | Client passed `amount` in request body for premium tour bookings. | Server derives prices strictly from internal constants (`config/constants.js`). Raw Stripe webhooks (`express.raw()`) verify cryptographic signatures before confirming bookings. |
| **Password Reset Vulnerability** | Reset tokens were reversible JWTs signed with general app secrets. | Replaced with cryptographically random bytes (`crypto.randomBytes(32)`), stored as a **one-way SHA-256 hash**, and enforced as single-use. |
| **ReDoS & Injection** | User search strings were passed raw into `new RegExp(query)`. | Implemented `utils/escapeRegex.js` with a 100-character cap, enabled Mongoose `sanitizeFilter`, and mounted `helmet()` + `express-rate-limit`. |

---

### Phase 2: Schema Redesign & Data Integrity

| Area | Before | Implemented in Commit `494911a` |
| :--- | :--- | :--- |
| **Unbounded Arrays** | `Conversation.messages` grew indefinitely as an embedded array, causing document bloat. | Removed embedded messages. Extracted messages into `models/Messages.js` with indexed `{ conversationId: 1, createdAt: -1 }`. |
| **Tour Double-Booking** | Concurrent buyers could book the same viewing slot at the exact same time. | Enforced a **MongoDB partial unique compound index** on `{ propertyId: 1, startTime: 1 }` where `status: 'scheduled'`, preventing race conditions at the database level. |
| **Timezone Booking Hazards** | Time parsing used browser-dependent `new Date(toLocaleString())`. | Implemented `luxon` to parse booking slots in `Asia/Dubai` time and store them normalized in UTC. |
| **Data Normalization** | Property seller was inconsistently referenced as `owner` or `seller`. | Standardized on `seller` across all models and created `scripts/migrateOwnerToSeller.js`. |
| **Offer Negotiation Engine** | Unidirectional seller responses with no counter-offer flow. | Implemented a real-time negotiation state machine in `socketConnection.js`: buyer submits offer ➔ seller accepts/counters/rejects ➔ acceptance marks property `under offer` and auto-rejects rival bids. |

---

### Phase 3: Clean Architecture, Config & Error Handling

* **Server / App Decoupling:** Split monolithic server into:
  * `app.js`: Express middleware pipeline, route mounting, error handling (exportable for integration tests).
  * `server.js`: HTTP server initialization, Socket.io attachment, cron bootstrap, and graceful shutdown listeners.
* **Centralized Environment Guard (`config/env.js`):** Validates all mandatory environment variables on startup and throws descriptive boot errors if secrets are missing.
* **Unified Error Pipeline (`middlewares/errorhandler.js`):** Standardized all route responses with `ApiResponse` and `ApiError`, handling Mongoose validation errors, duplicate keys (`11000`), JWT errors, and Multer limits while redacting stack traces in production.
* **Structured Logging:** Replaced raw `console.log` calls with `winston` structured JSON logging and `morgan` HTTP access logging.

---

### Phase 4: Automated Testing, Tooling & DevOps

* **In-Memory Testing Suite:** Integrated `jest`, `supertest`, and `mongodb-memory-server` in `tests/setup.js`. Includes integration tests for:
  * Authentication & role tampering prevention (`tests/auth.test.js`)
  * Property ownership & access bounds (`tests/property.test.js`)
  * Concurrency double-booking conflicts (`tests/tour.test.js`)
  * Socket negotiation & auth guards (`tests/socket.test.js`)
* **Containerization:** Added production `Dockerfile` using `node:20-alpine` with non-root security principles and `.dockerignore`.
* **API Documentation:** OpenAPI 3.0 interactive Swagger documentation mounted at `/api/docs` via `swagger-ui-express`.

---

### Phase 5: Production Business Capabilities

1. **Saved Searches & Daily Alert Workers (`models/SavedSearch.js`, `jobs/cronJobs.js`):** Saves user search filters; a daily 8:00 AM cron queries newly approved properties and dispatches email digests.
2. **Automated 24-Hour Tour Reminders:** Hourly cron job alerting buyers and sellers 24 hours prior to scheduled viewings.
3. **Seller Analytics Dashboard (`controllers/seller.controller.js`):** Aggregates listing statistics, active offers, tour counts, and deduplicated property views.
4. **Admin Moderation & Audit Trail (`models/AuditLog.js`):** Records all admin actions, user ban state transitions, and listing moderation status updates.
5. **Dual-Token Refresh Architecture (`models/RefreshToken.js`):** 15-minute access token paired with rotating 7-day refresh tokens stored in HTTP-only cookies.

---

## 3. Project File & Directory Structure in Commit `494911a`

```
server_clone/
├── .agent/skills/               # Custom agent operational instructions
├── .github/workflows/          # CI/CD pipelines (ci.yml / deploy.yml)
├── config/                      # Core configuration modules
│   ├── constants.js             # HTTP codes, status enums, fixed pricing constants
│   ├── db.js                    # Mongoose connection with retry & query sanitization
│   ├── emailTransporter.js      # Nodemailer SMTP transporter configuration
│   ├── env.js                   # Startup validation for mandatory environment variables
│   └── swagger.js               # OpenAPI / Swagger definition and spec builder
├── controllers/                 # MVC Controllers handling business logic
│   ├── admin.controller.js       # Admin moderation, user banning, audit inspections
│   ├── auth.controller.js        # Registration, login, password reset, token refresh
│   ├── category.controller.js    # Category retrieval and management
│   ├── contact.controller.js     # Contact queries & newsletter subscriptions
│   ├── favorite.controller.js    # User property bookmarking
│   ├── payment.controller.js     # Stripe Payment Intent creation & webhook listeners
│   ├── property.controller.js    # Property CRUD, geospatial & multi-filter search
│   ├── review.controller.js      # Property reviews & ratings
│   ├── savedSearch.controller.js # Saved filter alerts
│   ├── seller.controller.js      # Seller metrics and stats dashboard
│   └── tour.controller.js        # Concurrency-safe tour scheduling & slot availability
├── helpers/                     # Shared domain logic
│   └── auth.helper.js           # Secure cookie setter, JWT signer, and token verifier
├── jobs/                        # Automated background workers
│   └── cronJobs.js              # node-cron jobs (tour reminders & saved search alerts)
├── middlewares/                 # Express middleware pipeline
│   ├── adminAuth.js             # Admin authorization guard
│   ├── errorhandler.js          # Centralized ApiError & exception handler
│   ├── roleAuth.js              # Generic role-based access controller
│   ├── socketsToken.js          # Socket.io JWT handshake authenticator
│   └── verifyToken.js           # Express route JWT verification
├── models/                      # Mongoose ODM schemas & partial indexes
│   ├── AuditLog.js              # Historical log of admin operations
│   ├── Category.js              # Property taxonomy categories
│   ├── Contact.js               # Inbound inquiries
│   ├── Conversation.js          # Chat channel linking buyer, seller, and property
│   ├── Favorite.js              # User-to-property favorite relationship
│   ├── Messages.js              # Chat messages, offer payloads, reactions, edit states
│   ├── Newsletter.js            # Email subscriber lists
│   ├── Notification.js          # In-app notifications
│   ├── Property.js              # Listing schema, 2dsphere geo-index, text search index
│   ├── PropertyView.js          # Rate-limited view counter
│   ├── RefreshToken.js          # Hashed refresh token store for session rotation
│   ├── Reviews.js               # Verified buyer property reviews
│   ├── SavedSearch.js           # Persisted search parameters for alert digests
│   ├── Tour.js                  # Viewing appointments with partial unique index
│   └── User.js                  # User profile, credentials, role, lockout counters
├── routes/                      # API endpoint mappings
├── scripts/                     # Operational & migration utilities
│   ├── createAdmin.js           # Secure CLI admin creation script
│   └── migrateOwnerToSeller.js  # Schema data migration script
├── tests/                       # Automated test suite
│   ├── setup.js                 # MongoMemoryServer & mock transporter setup
│   ├── auth.test.js             # Auth security integration tests
│   ├── property.test.js         # Property ownership & isolation tests
│   ├── tour.test.js             # Concurrency & double-booking tests
│   └── socket.test.js           # WebSocket offer negotiation tests
├── utils/                       # Reusable utility helpers
│   ├── ApiError.js              # Standardized API Error class
│   ├── ApiResponse.js           # Standardized API Response payload wrapper
│   ├── asyncHandler.js          # Async controller wrapper catching rejections
│   ├── email.js                 # Transactional HTML email sender
│   ├── escapeHtml.js            # XSS defense helper
│   ├── escapeRegex.js           # ReDoS defense helper
│   ├── fileUpload.js            # Multer memory storage & Cloudinary uploader
│   └── logger.js                # Winston file & console structured logger
├── app.js                       # Express app bootstrap & route configuration
├── server.js                    # HTTP server, WebSockets & graceful shutdown
├── Dockerfile                   # Production container definition
└── package.json                 # Dependency manifest
```

---

## 4. Complete Package Inventory

### 4.1. Production Dependencies

| Package | Version | Architectural Role & Purpose |
| :--- | :--- | :--- |
| **`express`** | `^4.19.2` | Core web framework providing HTTP request routing and middleware handling. |
| **`mongoose`** | `^8.4.4` | MongoDB Object Data Modeling (ODM), managing schema definitions, indexes, and query sanitization. |
| **`socket.io`** | `^4.8.1` | Bidirectional real-time engine for buyer-seller live chat and negotiation state machine. |
| **`stripe`** | `^16.12.0` | Payment gateway SDK for server-validated Payment Intents and webhook signature verification. |
| **`jsonwebtoken`** | `^9.0.2` | Cryptographic JWT signing and verification for access tokens and temporary OAuth signup tokens. |
| **`bcryptjs`** | `^2.4.3` | Salted password hashing algorithm safeguarding credentials at rest. |
| **`cookie-parser`** | `^1.4.7` | Parses incoming cookie headers, enabling extraction of HTTP-only JWTs. |
| **`cors`** | `^2.8.5` | Enforces Cross-Origin Resource Sharing with whitelisted frontend domain origins. |
| **`helmet`** | `^8.3.0` | Sets critical HTTP security headers preventing XSS, clickjacking, and MIME sniffing. |
| **`express-rate-limit`** | `^8.7.0` | Rate-limiting middleware defending sensitive endpoints against brute-force and DDoS attacks. |
| **`express-validator`** | `^7.2.1` | Declarative schema validation and sanitization for incoming request bodies, queries, and params. |
| **`luxon`** | `^3.4.4` | Enterprise timezone math normalizing client local time (`Asia/Dubai`) to UTC for database storage. |
| **`node-cron`** | `^4.6.0` | Background task scheduler running daily property search alerts and hourly tour reminders. |
| **`nodemailer`** | `^6.9.14` | SMTP client dispatching transactional verification, alert, and notification emails. |
| **`multer`** | `^1.4.5-lts.1` | Handles `multipart/form-data` uploads with file size and MIME-type restrictions. |
| **`cloudinary`** | `^2.9.0` | Cloud media CDN managing storage, transformations, and delivery of property images. |
| **`passport`** | `^0.7.0` | Authentication middleware infrastructure. |
| **`passport-google-oauth20`**| `^2.0.0` | Google OAuth 2.0 social login integration. |
| **`winston`** | `^3.19.0` | Production logging framework supporting structured JSON formats, log levels, and rotating files. |
| **`morgan`** | `^1.10.0` | HTTP request logging middleware piped directly into Winston. |
| **`dotenv`** | `^16.4.7` | Loads runtime environment variables from `.env`. |
| **`swagger-ui-express`** | `^5.0.1` | Serves interactive Swagger API explorer UI. |
| **`swagger-jsdoc`** | `^6.3.0` | Generates OpenAPI 3.0 specifications from JSDoc route annotations. |

### 4.2. Development & Testing Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`jest`** | `^30.5.2` | Primary unit and integration test runner. |
| **`supertest`** | `^7.3.0` | High-level HTTP assertion library testing Express endpoints without port binding. |
| **`mongodb-memory-server`** | `^11.3.0` | Ephemeral, in-memory MongoDB engine for isolated, zero-dependency integration tests. |
| **`socket.io-client`** | `^4.8.4` | Programmatic socket client testing real-time events, negotiation rules, and auth in Jest. |
| **`nodemon`** | `^3.1.11` | Developer file watcher auto-restarting the server during local development. |
| **`eslint`** | `^10.11.0` | Static code analysis and linting engine. |
| **`prettier`** | `^3.9.9` | Opinionated code formatter enforcing consistent styling across team members. |

### 4.3. Packages Purged & Technical Rationale

* ❌ **`faker` (`v6.6.6`):** The author of this release intentionally compromised the library with infinite loops. Purged to prevent build corruption.
* ❌ **`joi`:** The codebase previously contained both Joi and `express-validator`. Joi was eliminated to unify on a single validation standard.
* ❌ **`express-session`:** Replaced by stateless JWTs in HTTP-only cookies; server-side session stores waste memory and hinder horizontal scaling.
* ❌ **`body-parser`:** Redundant external package; natively built into Express 4.16+ (`express.json()`, `express.raw()`).
* ❌ **`typeface-quicksand`:** Erroneously installed frontend typography package removed from backend dependencies.

---

## 5. Evolution from Commit `494911a` to Current `HEAD` (`3e41622`)

Comparing commit **`494911a`** to the current repository state reveals two key changes:

1. **Automated EC2 CI/CD Deployment (`.github/workflows/deploy.yml`):**
   * Replaced the generic CI test check with an automated deployment pipeline.
   * On every `push` to `main`, GitHub Actions establishes an SSH connection to your EC2 instance (`3.27.86.15`), pulls the latest code, runs `npm install --production`, and seamlessly restarts the application with `pm2 restart luxus-backend`.
2. **Health and Verification Endpoints (`app.js`):**
   * Added `/api/testing` as a deployment verification endpoint alongside `/api/health`.
