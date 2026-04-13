# Car Rental Management System

Production-oriented, full-stack car rental SaaS built with Angular and NestJS.

The platform supports multi-role operations for booking, fleet operations, support, payments, notifications, metrics, and administration.

## Project Overview

This repository contains:

- `frontend/`: Angular web client
- `backend/`: NestJS API server with Prisma + PostgreSQL

Primary goals:

- Role-based access control for operational safety
- Reliable booking and payment workflows
- Fleet and user administration
- Production-ready deployment and observability path

## Role-Based Features

### Admin / Main Admin

- Manage agents (create, activate/deactivate, delete)
- Manage vehicles (create, update, delete, inventory listing)
- Review and update booking statuses
- Send and review notifications
- View dashboard statistics and summary metrics
- Manage admin accounts (main admin restricted operations)

### Agent

- Login as operational agent
- View assigned bookings
- Update assigned booking status
- Report vehicle issues
- View personal operational metrics

### Driver

- Current state: Dedicated driver module and role endpoints are not implemented yet.
- Planned production scope:
     - Receive assigned trips
     - Accept/reject assignments
     - Update trip lifecycle (`accepted`, `ongoing`, `completed`)
     - Access pickup/drop-off details and customer contact metadata

### Customer (User)

- Register/login
- Browse and search vehicles
- Create bookings
- View own booking history
- Cancel own bookings
- Create payments for own bookings
- Open support tickets
- Leave and view reviews

## Tech Stack

- Frontend: Angular
- Backend: NestJS
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Auth: JWT + Passport
- Validation: class-validator + Nest ValidationPipe

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd car-rental-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp dummy.env.txt .env
```

Update `.env` values for your environment.

Run migrations and generate Prisma client:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

Start backend:

```bash
npm run start:dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run start
```

Frontend default URL: `http://localhost:4200`  
Backend default URL: `http://localhost:3000`

## Environment Variables

Create `backend/.env` from `backend/dummy.env.txt`.

Required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: token lifetime (for example `1d`)
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `APP_URL`
- `FRONTEND_URL`: allowed CORS origin(s), comma-separated for multiple origins

## Basic API Endpoints

Authentication:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`

Vehicles:

- `GET /vehicles`
- `GET /vehicles/search`
- `GET /vehicles/:id`
- `POST /vehicles` (ADMIN, MAIN_ADMIN)
- `PATCH /vehicles/:id` (ADMIN, MAIN_ADMIN)
- `DELETE /vehicles/:id` (ADMIN, MAIN_ADMIN)

Bookings:

- `POST /bookings` (USER)
- `GET /bookings/mine` (USER)
- `GET /bookings/my` (USER)
- `GET /bookings/pending` (ADMIN, MAIN_ADMIN, AGENT)
- `PATCH /bookings/:id/status` (ADMIN, MAIN_ADMIN, AGENT)
- `PATCH /bookings/:id/assign/:agentId` (ADMIN, MAIN_ADMIN)
- `PATCH /bookings/:id/cancel` (USER, ADMIN, MAIN_ADMIN, AGENT)
- `GET /bookings/:id` (USER, ADMIN, MAIN_ADMIN, AGENT with scoped access)

Payments:

- `POST /payments` (USER, own booking only)
- `GET /payments/me` (USER)
- `GET /payments` (ADMIN, MAIN_ADMIN)
- `GET /payments/:id` (ADMIN, MAIN_ADMIN)

Support:

- `POST /support` (USER)
- `GET /support/mine` (USER)
- `GET /support` (ADMIN, MAIN_ADMIN)

Metrics:

- `GET /metrics/user`
- `GET /metrics/agent`
- `GET /metrics/admin`

## Usage Guide

Typical workflow:

1. Customer registers/logs in.
2. Customer browses vehicles and creates booking.
3. Customer submits payment for their booking.
4. Admin/agent reviews pending bookings and updates status.
5. Agent manages assigned booking operations.
6. Admin monitors dashboard, fleet, and users.

## Deployment Instructions

### Backend

```bash
cd backend
npm ci
npm run build
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:prod
```

Production checklist:

- Set strong `JWT_SECRET`
- Restrict `FRONTEND_URL` to trusted domains
- Use managed PostgreSQL with backups
- Enable centralized logs and metrics
- Add HTTPS and reverse proxy (Nginx/Cloud load balancer)

### Frontend

```bash
cd frontend
npm ci
npm run build
```

Deploy Angular build output (configured in `vercel.json`) to Vercel or equivalent static hosting.

## Testing

Backend:

```bash
cd backend
npm run test
npm run test:e2e
```

Frontend:

```bash
cd frontend
npm run test
```

## Contribution Guidelines

1. Create a feature branch from `main`.
2. Keep changes focused and atomic.
3. Run lint/tests before pushing.
4. Open a pull request with testing notes and risk summary.

## Git Workflow (Production Upgrade Example)

```bash
git checkout -b production-upgrade
git add .
git commit -m "fix: enforce booking and payment authorization boundaries"
git commit -m "docs: upgrade README for production operations"
git push origin production-upgrade
```

Example PR sections:

- Summary: role enforcement hardening, payment validation, docs upgrade
- Improvements: RBAC fixes, booking ownership checks, payment integrity checks
- Testing notes: backend type-check/tests, manual API flow checks

## License

This project is currently private/proprietary unless a license file states otherwise.
