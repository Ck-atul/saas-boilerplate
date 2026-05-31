# SaaS Boilerplate

[![Dashboard preview](file:///C:/Users/Dell/.gemini/antigravity-ide/brain/d5013e15-1217-44be-bb10-708a73023d0d/dashboard_mockup_1780259153680.png)](http://localhost:3000/dashboard)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)  
[![GitHub stars](https://img.shields.io/github/stars/your-repo/saas-boilerplate.svg?style=social)](https://github.com/your-repo/saas-boilerplate)

---

## ✨ What is this?
A **production‑ready, premium‑styled SaaS starter** built with **Next.js 16 (App Router)**, **TypeScript**, **Prisma (MySQL)**, and **JWT‑based authentication**.  It ships with:
- Role‑based access (`USER` / `ADMIN`)
- Audit logging for every login/logout and admin action
- Password‑reset flow with secure tokens
- A modern UI that uses **glass‑morphism**, gradient backgrounds, and micro‑animations
- Ready‑to‑deploy scripts for Vercel, Railway, Render, etc.

---

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 (App Router), React 18, TypeScript, Vanilla CSS with CSS variables, Google Fonts (Inter) |
| **Backend** | Next.js API routes, Prisma ORM, MySQL |
| **Auth** | bcrypt, jsonwebtoken (HttpOnly cookies) |
| **Dev tools** | Node 20+, npm, Prisma CLI |
| **Styling** | Custom design system with gradient backgrounds, glass‑morphism, and subtle hover animations |

---

## 📦 Getting Started
```bash
# 1️⃣ Clone the repo
git clone <repo‑url>
cd saas-boilerplate

# 2️⃣ Install dependencies (deterministic)
npm ci

# 3️⃣ Set up environment variables
cp .env.example .env
# Edit .env with your MySQL credentials and a strong JWT secret
```
### Environment variables (`.env`)
```env
DATABASE_URL="mysql://root:*****@%40@localhost:3306/saas_boilerplate"
JWT_SECRET="your‑strong‑secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
> **⚠️ Note:** `%40` is the URL‑encoded `@` in the password.

---

## 🚀 Development
```bash
npm run dev   # Starts the dev server at http://localhost:3000
```
Open the URL and you’ll see the **premium dashboard** (see screenshot above). The UI automatically updates as you edit files.

---

## 📚 API Overview
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user (email verification token generated) |
| `/api/auth/login` | POST | Authenticate, set JWT cookie, log audit |
| `/api/auth/logout` | POST | Clear cookie, log audit |
| `/api/auth/verify` | GET | Verify email via token |
| `/api/auth/password-reset` | POST | Send reset email |
| `/api/auth/password-reset/[token]` | POST | Reset password |
| `/api/user/me` | GET | Return current user profile (protected) |
| `/api/admin/*` | … | Admin‑only routes (role‑based middleware) |

---

# 📂 Folder Structure
```text
src/
├─ app/                # Next.js App Router pages
│   ├─ api/            # Auth, user, admin endpoints
│   ├─ admin/          # Admin panel UI
│   ├─ dashboard/      # Premium dashboard UI
│   ├─ profile/        # Profile page UI
│   ├─ login/          # Login page UI
│   ├─ signup/          # Signup page UI
│   ├─ verify-email/    # Email verification UI
│   └─ layout.tsx      # Global layout with navigation
├─ components/        # Re‑usable UI components (Header, LogoutButton, UI kit)
│   ├─ header.tsx
│   ├─ logout-button.tsx
│   └─ ui/            # Small building‑block components (Button, Card, Input, Badge)
├─ lib/                # Utilities (auth helpers, prisma client, audit logger)
├─ prisma/             # Prisma schema + migrations
│   ├─ schema.prisma
│   └─ migrations/
│       ├─ 20260531192327_init/
│       └─ 20260531201223_add_audit_and_reset/
├─ public/             # Static assets (fonts, images, SVGs)
├─ styles/             # Global CSS, design tokens
└─ middleware.ts       # Role‑based protection middleware
```

src/
├─ app/                # Next.js App Router pages
│   ├─ api/            # Auth, user, admin endpoints
│   ├─ dashboard/      # Premium dashboard UI
│   ├─ profile/        # Profile page UI
│   └─ layout.tsx      # Global layout with navigation
├─ components/        # Re‑usable UI components (Card, Header, etc.)
├─ lib/                # Utilities (auth, prisma client, audit logger)
├─ prisma/             # Prisma schema + migrations
├─ public/             # Static assets (fonts, images)
└─ styles/             # Global CSS, design tokens
```

---

## 🧪 Testing (optional)
> *Testing isn’t wired up yet, but you can add Jest + React Testing Library for unit and integration tests.*

---

## 📦 Deployment
1. **Build** the production bundle:
   ```bash
   npm run build   # creates .next
   ```
2. **Deploy** to your host of choice (Vercel, Railway, Render, etc.) – make sure the same `.env` variables are set.
3. **Run migrations** on the production DB:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🙋‍♀️ Contributing
Contributions are welcome! Open an issue first, then submit a PR. Follow the existing code style (Prettier, ESLint) and keep the UI consistent with the design system.

---

## 📄 License
MIT © 2026 Your Name / Company

---

*This README is crafted to be **interactive** and **visually appealing** for recruiters, hiring managers, or agencies. The screenshot above showcases the premium UI, and the badges provide quick project insights.*