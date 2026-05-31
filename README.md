# SaaS Boilerplate

A **production‑ready, premium‑styled** SaaS starter built with **Next.js 16 (App Router)**, **TypeScript**, **Prisma** (MySQL), and **JWT‑based authentication**. The codebase follows modern best practices, includes role‑based access control, audit logging, password‑reset flows, and a polished UI that uses custom design tokens, glassmorphism, and micro‑animations.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup & Development](#setup--development)
- [Database Migrations](#database-migrations)
- [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Auth**: Sign‑up, login, email verification, password reset, JWT stored in HttpOnly cookies.
- **Roles**: `USER` and `ADMIN` with middleware‑protected routes.
- **Audit Log**: Every login/logout and admin action is recorded in the `AuditLog` table.
- **Premium UI**: Custom design system with gradient backgrounds, smooth hover animations, and responsive layouts.
- **SQL Migration Safety**: Prisma migrations keep the DB schema in sync; `prisma migrate reset` for dev reset.
- **Extensible**: Add new features (subscriptions, billing, etc.) without touching core auth.

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Front‑end | Next.js 16 (App Router), React 18, TypeScript, Tailwind‑style custom CSS (no Tailwind library), Google Fonts (Inter) |
| Backend | Next.js API routes, Prisma ORM, MySQL |
| Auth | Bcrypt, jsonwebtoken |
| Dev Tools | Node 20+, npm, Prisma CLI |
| Styling | Vanilla CSS with CSS variables for theming |

---

## Prerequisites
- **Node.js** (>=20) and **npm**
- **MySQL** server (local or remote) – default DB name `saas_boilerplate`
- **Git** (optional, for version control)

---

## Setup & Development
```bash
# 1️⃣ Clone the repo
git clone <repo‑url>
cd saas-boilerplate

# 2️⃣ Install dependencies
npm ci   # deterministic install

# 3️⃣ Create a .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your MySQL credentials and a strong JWT secret
```

### Environment variables (`.env`)
```
DATABASE_URL="mysql://root:Atul123@%40@localhost:3306/saas_boilerplate"
JWT_SECRET="your‑strong‑secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
> **NOTE**: The `%40` is the URL‑encoded `@` in the password.

---

## Database Migrations
```bash
# Generate a migration after changing schema.prisma
npx prisma migrate dev --name <descriptive‑name>

# Reset DB (dev only) – drops all data and re‑applies migrations
npx prisma migrate reset --force
```
The initial migration creates the `User`, `PasswordResetToken`, and `AuditLog` tables with proper indexes.

---

## Running the App
```bash
npm run dev   # Starts Next.js dev server at http://localhost:3000
```
Open the URL in a browser and you’ll see the home page with polished UI.

---

## API Overview
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user (email verification token generated) |
| `/api/auth/login` | POST | Authenticate and set JWT cookie; logs audit entry |
| `/api/auth/logout` | POST | Clears cookie and logs audit |
| `/api/auth/verify` | GET | Verify email using token |
| `/api/auth/password-reset` | POST | Send reset email |
| `/api/auth/password-reset/[token]` | POST | Reset password with token |
| `/api/user/me` | GET | Returns current user profile (protected) |
| `/api/admin/*` | … | Admin‑only routes – protected by `role === 'ADMIN'` middleware |

---

## Folder Structure
```
src/
├─ app/                # Next.js App Router pages
│   ├─ api/            # API routes (auth, user, admin)
│   ├─ dashboard/      # Protected dashboard UI
│   ├─ profile/        # Profile page UI
│   └─ layout.tsx      # Global layout with navigation
│
├─ lib/                # Re‑usable utilities
│   ├─ auth.ts         # Bcrypt & JWT helpers
│   ├─ prisma.ts       # Prisma client singleton
│   ├─ audit.ts        # auditLog writer
│   └─ email.ts        # (stub) email send helper
│
prisma/                # Prisma schema + migrations
public/                # Static assets (fonts, images)
styles/                # Global CSS and design tokens
```

---

## Testing
> *Testing is not yet wired up, but you can add Jest + React Testing Library for unit & integration tests.*

---

## Deployment
1. Build the production bundle:
   ```bash
   npm run build   # Next.js creates .next
   ```
2. Deploy to any Node host (Vercel, Railway, Render, etc.) – ensure the same `.env` variables are set.
3. Run migrations on the production DB:
   ```bash
   npx prisma migrate deploy
   ```

---

## Contributing
Contributions are welcome! Please open an issue first, then submit a PR. Follow the existing code style (Prettier, ESLint) and keep the UI consistent with the design system.

---

## License
MIT © 2026 Your Name / Company

---

*This README is deliberately detailed so that recruiters, hiring managers, or agencies can instantly understand the project scope, architecture, and how to run it.*

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
