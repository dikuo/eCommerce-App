# E-Commerce Platform

A full-stack e-commerce application built with the MERN stack, featuring multi-gateway payment integration, Docker containerization, and a comprehensive RESTful API for inventory management.

## 🚀 Live Demo

- **Frontend Application:** [https://forever-frontend-self-tau.vercel.app/](https://forever-frontend-self-tau.vercel.app/)
- **Admin Panel:** [https://forever-admin-five-hazel.vercel.app/](https://forever-admin-five-hazel.vercel.app/)

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This e-commerce platform provides a complete solution for online retail operations, featuring a customer-facing frontend, an administrative dashboard, and a robust backend API. The application is designed with scalability, security, and maintainability in mind, leveraging modern development practices and infrastructure automation.

## Core Features

### 🛒 E-Commerce Functionality
- **Product Catalog**: Browse and search through a comprehensive product inventory
- **Shopping Cart**: Add, update, and manage cart items with real-time synchronization
- **Order Management**: Complete order lifecycle from placement to fulfillment
- **User Authentication**: Secure registration and login system with JWT-based authentication
- **Admin Dashboard**: Comprehensive admin panel for product and order management

### 💳 Multi-Gateway Payment Integration
- **Stripe Integration**: Secure credit card processing via Stripe Checkout
- **PayPal Integration**: PayPal payment processing with order capture verification
- **Cash on Delivery (COD)**: Alternative payment method for local deliveries
- **Payment Verification**: Automated verification system for all payment methods

### 🔐 Security & Infrastructure
- **Secrets Management**: Environment-based configuration for API credentials and sensitive data
- **JWT Authentication**: Token-based authentication for secure API access
- **Admin Authorization**: Role-based access control for administrative functions
- **CORS Configuration**: Secure cross-origin resource sharing

## Technology Stack

### Frontend
- **React 19**: Modern UI library with hooks and context API
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **React Toastify**: User notification system

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js 5**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Cloud-based image management

### Payment Gateways
- **Stripe SDK**: Payment processing integration
- **PayPal Server SDK**: PayPal payment integration

### Infrastructure
- **Docker**: Containerization for consistent deployment environments
- **Vercel**: CI/CD pipeline and serverless deployment
- **MongoDB Atlas**: Cloud database hosting

## Architecture

The application follows a three-tier architecture:

1. **Frontend Layer**: React-based user interface for customers
2. **Admin Layer**: React-based administrative dashboard
3. **Backend Layer**: Express.js RESTful API server

All components communicate through well-defined REST endpoints, ensuring separation of concerns and maintainability.

## Key Features

### RESTful API Design
The backend implements a comprehensive RESTful API architecture for inventory control and order management:

- **Product Management**: CRUD operations for product catalog
- **Cart Operations**: Add, update, and retrieve cart data
- **Order Processing**: Order placement, status updates, and history
- **User Management**: Registration, authentication, and profile management

### Docker Containerization
The backend is containerized using Docker, ensuring:
- **Environment Consistency**: Identical runtime environments across development, staging, and production
- **Easy Deployment**: Simplified deployment process with container orchestration
- **Scalability**: Horizontal scaling capabilities through container replication

### CI/CD Pipeline
Automated deployment pipeline configured via Vercel:
- **Continuous Integration**: Automated testing and build verification
- **Continuous Deployment**: Automatic deployment on code push
- **Environment Management**: Separate configurations for different deployment stages

### Secrets Management
Secure handling of sensitive credentials:
- Environment variables for API keys (Stripe, PayPal, MongoDB, Cloudinary)
- No hardcoded secrets in source code
- Support for different configurations per environment

## API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

### Product Endpoints
- `GET /api/product/list` - Get all products
- `POST /api/product/single` - Get single product details
- `POST /api/product/add` - Add new product (Admin only)
- `POST /api/product/remove` - Remove product (Admin only)

### Cart Endpoints
- `POST /api/cart/get` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart items

### Order Endpoints
- `POST /api/order/place` - Place order (COD)
- `POST /api/order/stripe` - Place order with Stripe
- `POST /api/order/paypal` - Place order with PayPal
- `POST /api/order/verifyStripe` - Verify Stripe payment
- `POST /api/order/verifyPaypal` - Verify PayPal payment
- `POST /api/order/userorders` - Get user orders
- `POST /api/order/list` - Get all orders (Admin only)
- `POST /api/order/status` - Update order status (Admin only)

## Installation

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local or Atlas)
- Docker (optional, for containerized deployment)
- Stripe account and API keys
- PayPal developer account and credentials
- Cloudinary account for image storage

### Backend Setup

```bash
cd app/backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Setup

```bash
cd app/frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=your_backend_api_url
```

### Admin Setup

```bash
cd app/admin
npm install
```

Create a `.env` file in the admin directory:

```env
VITE_BACKEND_URL=your_backend_api_url
```

## Configuration

### Environment Variables

All sensitive credentials are managed through environment variables. Ensure all required variables are set before running the application.

### Docker Deployment

To build and run the backend using Docker:

```bash
cd app/backend
docker build -t ecommerce-backend .
docker run -p 4000:4000 --env-file .env ecommerce-backend
```

## Deployment

The application is configured for deployment on Vercel with automatic CI/CD:

1. **Backend**: Deployed as serverless functions
2. **Frontend**: Static site deployment with Vercel
3. **Admin**: Static site deployment with Vercel

The `vercel.json` configuration files in each directory handle routing and build settings automatically.

## Project Structure

```
eCommerce/
├── app/
│   ├── backend/          # Express.js API server
│   │   ├── config/       # Database and service configurations
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Authentication and file upload
│   │   ├── models/       # Mongoose data models
│   │   ├── routes/       # API route definitions
│   │   ├── Dockerfile    # Docker configuration
│   │   └── server.js     # Application entry point
│   ├── frontend/         # Customer-facing React application
│   │   └── src/
│   │       ├── components/  # Reusable UI components
│   │       ├── pages/       # Page components
│   │       └── context/     # React context providers
│   └── admin/            # Admin dashboard React application
│       └── src/
│           ├── components/  # Admin UI components
│           └── pages/       # Admin page components
└── assets/               # Shared assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Repository**: [https://github.com/dikuo/eCommerce-App](https://github.com/dikuo/eCommerce-App)
