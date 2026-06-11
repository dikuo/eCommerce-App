# CaraStyle E-Commerce Platform

A full-stack MERN e-commerce application modernized with Next.js, a Go inventory microservice, and Kubernetes-based infrastructure. Features multi-gateway payments, containerized services, and automated testing.

## Live Deployments

- **Frontend:** [carastyle-frontend.vercel.app](https://carastyle-frontend.vercel.app/)
- **Admin Dashboard:** [carastyle-admin.vercel.app](https://carastyle-admin.vercel.app/)
- **Backend API:** [carastyle-backend.vercel.app](https://carastyle-backend.vercel.app/)

## Tech Stack

**Frontend:** Next.js (ISR), React, Tailwind CSS
**Backend:** Node.js, Express, MongoDB Atlas
**Inventory Service:** Go (REST API)
**Payments:** Stripe, PayPal
**Auth:** JWT
**Testing:** Jest, Playwright
**Infrastructure:** Docker, Kubernetes, GitHub Actions CI/CD, Vercel

## Features

- JWT-based authentication for users and admins
- Full product and order CRUD via the Admin panel
- Shared TypeScript types across frontend, admin, and backend via a common `shared/` package
- Incremental Static Regeneration (ISR) on Collections and Product pages
- Real-time inventory tracking via a dedicated Go microservice
- Multi-gateway checkout (Stripe, PayPal)
- Cloudinary integration for product image storage
- Containerized with Docker; Kubernetes manifests for self-healing and horizontal scaling
- Jest unit tests + Playwright E2E tests, run via GitHub Actions CI/CD

## Project Structure

```
eCommerce-App/
├── frontend/        # Next.js storefront
├── admin/           # Admin dashboard
├── backend/
│   ├── api/         # Go inventory microservice (main.go)
│   └── ...          # Express API
├── shared/          # Shared TypeScript types across frontend/backend
├── k8s/             # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── inventory-deployment.yaml
│   └── secrets.yaml
└── tests/           # Playwright E2E tests
```

## Getting Started (Local)

### Frontend / Admin / Backend

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

Configure `.env` files:
- `/backend` — MongoDB URI, Stripe keys, Cloudinary keys
- `/frontend` — `VITE_BACKEND_URL`

### Go Inventory Service

```bash
cd backend/api
go run main.go
```

Runs on `localhost:8080`. Requires a `MONGODB_URI` environment variable.

## Kubernetes Deployment

```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/
```

> `secrets.yaml` must include `MONGODB_URI` and other required secrets before applying the deployments.

## Testing

```bash
# Unit tests
npm test

# E2E tests
npx playwright test
```

---

**Author:** Kevin Cai | [github.com/dikuo](https://github.com/dikuo)
