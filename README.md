# Digital Wardrobe Backend API

A RESTful API for managing a digital wardrobe. This service allows users to digitally inventory their clothing, curate outfits, track wear history, and manage their personal style calendar.

## Tech Stack

- Runtime: Node.js (v22)
- Framework: Express.js
- Database: PostgreSQL (via Sequelize ORM and Umzug for migrations)
- Authentication: AWS Cognito (JWT)
- File Storage: AWS S3 (Presigned URLs)
- Containerization: Docker & Docker Compose
- CI/CD: GitHub Actions to AWS Elastic Beanstalk

---

## Prerequisites

To run this project locally, you will need:
- Docker & Docker Compose
- Node.js (v22+)
- An AWS Account (for Cognito Auth and S3 Buckets)

---

## Local Development Setup

We use Docker Compose to provide a seamless, isolated local development environment that perfectly mirrors production.

### 1. Environment Variables
Create a `.env` file in the root directory. Below is the complete list of required and optional environment variables used in `config/index.js` and `compose.dev.yaml`:

```ini
# Application Core
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Database Connection
DB_HOST=db
DB_NAME=digital_wardrobe
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_POOL_MAX=50
DB_POOL_MIN=10
DB_LOGGING=false

# Automatic Database Management
RUN_MIGRATIONS=true
RUN_SEEDERS=true

# Local Database Viewer (pgAdmin)
PGADMIN_MAIL=admin@admin.com
PGADMIN_PASSWORD=admin

# AWS Infrastructure
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name
S3_ACCESS_KEY=your_s3_key
S3_ACCESS_SECRET=your_s3_secret
COGNITO_USER_POOL_ID=your_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_CLIENT_SECRET=your_client_secret
COGNITO_ACCESS_KEY=your_cognito_key
COGNITO_ACCESS_SECRET=your_cognito_secret

# Logging (Winston/Morgan)
LOG_FORMAT=dev
LOG_DIR=../logs
```

### 2. Start the Development Server
Use the dedicated development compose file which mounts your local codebase for hot-reloading:
```bash
docker compose -f compose.dev.yaml up --build
```
The API will be available at `http://localhost:3000`.
pgAdmin will be available at `http://localhost:5050`.

*Note: If `RUN_MIGRATIONS` and `RUN_SEEDERS` are set to `true`, the application will automatically run pending migrations and inject default database seeds on startup.*

---

## Project Architecture

This codebase follows a strict Controller-Service-Route architecture to cleanly separate HTTP transport logic from business logic.

- config/ : Centralized configuration and AWS/DB initializations
- controllers/ : Handles HTTP requests, responses, and payload extraction
- middleware/ : Express middlewares (Auth verification, Error handling, Rate limiting)
- migrations/ : Sequelize database schema definitions
- models/ : Sequelize ORM models and relationships
- routes/ : Express router definitions
- seeders/ : Default database states (Cloth types, statuses, tags)
- services/ : Core business logic and database interactions
- utils/ : Helper functions (Logger, AWS Error wrappers)
- validations/ : Zod validation schemas for request bodies

---

## Deployment Architecture

This application is designed for enterprise-grade deployment on AWS Elastic Beanstalk using a GitHub Actions CI/CD pipeline.

- Production Dockerfile: The root `Dockerfile` uses an optimized `npm ci --omit=dev` build for a highly secure, lightweight image.
- Pipeline: Pushing to the `main` branch triggers `.github/workflows/deploy.yml`.
- Workflow: 
  1. Runs ESLint checks.
  2. Packages the source code.
  3. Pushes to a secure S3 deployment bucket using official AWS CLI commands.
  4. Triggers AWS Elastic Beanstalk to pull the new version and update the environment.
- Production Database: In production, `DB_HOST` must be pointed to an external AWS RDS PostgreSQL instance to ensure data persistence.

---

## Testing & Code Quality

To ensure code stability before deployment, run the following quality checks:

```bash
# Run ESLint to catch syntax and anti-pattern errors
npm run lint
```
