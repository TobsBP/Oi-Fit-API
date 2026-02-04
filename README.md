# Oi-Fit API

A robust RESTful API developed with **Fastify** and **TypeScript**, designed to manage products, users, addresses, and authentication. The API integrates with **Supabase** as a Backend-as-a-Service (BaaS) and uses **Zod** for rigorous data validation.

## 🚀 Technologies

- **Framework:** [Fastify](https://www.fastify.io/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database/BaaS:** [Supabase](https://supabase.com/)
- **Validation:** [Zod](https://zod.dev/) (via `fastify-type-provider-zod`)
- **Authentication:** [Fastify JWT](https://github.com/fastify/fastify-jwt)
- **Documentation:** [Swagger](https://swagger.io/) & [Scalar](https://scalar.com/)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)
- **Build:** [Babel](https://babeljs.io/)

## 🏗️ Architecture

The project follows a layered architecture for better maintainability and scalability:

- **Routes:** Endpoint definitions and validation schemas.
- **Controllers:** Orchestration of requests and responses.
- **Services:** Application business logic.
- **Repositories:** Direct communication with Supabase/Database.
- **Types:** TypeScript type definitions and Zod schemas.
- **Lib:** External library configurations (e.g., Supabase Client).

## 📋 Prerequisites

- Node.js (v20 or higher recommended)
- A Supabase account with an active project.

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd oi-fit-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root with the following keys:
   ```env
   JWT_SECRET=your_jwt_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## ⚙️ Available Scripts

- `npm run dev`: Starts the server in development mode with hot-reload (using `tsx` and `nodemon`).
- `npm run build`: Compiles the TypeScript project to JavaScript in the `dist` folder using Babel.
- `npm start`: Starts the server from the compiled code in `dist`.
- `npm run lint`: Runs Biome to check and fix linting and formatting issues.

## 🐳 Docker

You can also run the application using Docker:

1. Build the image:
   ```bash
   docker build -t oi-fit-api .
   ```

2. Start the container (remember to pass the environment variables):
   ```bash
   docker run -p 3333:3333 \
     -e JWT_SECRET=your_secret \
     -e SUPABASE_URL=your_url \
     -e SUPABASE_ANON_KEY=your_key \
     oi-fit-api
   ```

## 📖 API Documentation

Interactive API documentation is available via Scalar. With the server running, access:

`http://localhost:3333/docs`

### Main Modules:
- **Auth:** User registration and login with JWT token generation.
- **Users:** User profile management.
- **Products:** Product listing and management.
- **Address:** Management of addresses linked to users.

---
Developed by [tobias.bp2004@gmail.com](mailto:tobias.bp2004@gmail.com)