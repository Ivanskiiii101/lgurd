# L'GURD E-Commerce

A production-ready, full-stack e-commerce application for luxury perfume brand L'GURD, built with Next.js 15, TypeScript, Prisma, Stripe, and Resend.

## Features

- 🛍️ **Product Gallery** - Beautiful, responsive product cards with gold hover effects
- 🛒 **Shopping Cart** - Persistent cart with localStorage, slide-out drawer UI
- 💳 **Stripe Checkout** - Secure payment processing with hosted checkout
- 📧 **Email Notifications** - Automated customer and admin emails via Resend
- 🗄️ **PostgreSQL Database** - Prisma ORM with type-safe database access
- 🐳 **Docker Support** - Complete Docker Compose setup for easy deployment
- 🎨 **Luxury Design** - Dark mode with polished gold accents

## Quick Start with Docker

```bash
# 1. Clone and setup
cp env.example .env.local
# Edit .env.local with your API keys

# 2. Start everything
docker-compose up --build

# 3. Access the app
# http://localhost:3000
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL with Docker
docker-compose up -d postgres

# 3. Setup environment
cp env.example .env.local
# Edit .env.local

# 4. Setup database
npx prisma migrate dev --name init
npx prisma db seed

# 5. Start dev server
npm run dev
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe Checkout
- **Emails:** Resend
- **State Management:** React Context API
- **Containerization:** Docker & Docker Compose

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── actions/      # Server Actions (Stripe checkout)
│   │   ├── api/          # API routes (webhooks)
│   │   └── success/      # Order success page
│   ├── components/       # React components
│   ├── context/          # React Context (Cart)
│   └── lib/              # Utilities (DB, Stripe, Resend)
├── prisma/               # Database schema and migrations
├── docker-compose.yml    # Docker services
└── Dockerfile            # Multi-stage build
```

## Environment Variables

Required environment variables (see `env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend API key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View logs
npm run docker:build     # Build images
```

## Testing the Application

1. **Browse Products** - Visit `http://localhost:3000`
2. **Add to Cart** - Click "Add to Cart" on products
3. **Checkout** - Click "Panier" → "Commander"
4. **Test Payment** - Use Stripe test card: `4242 4242 4242 4242`
5. **Verify** - Check success page, emails, and database

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Docker-specific guide
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide

## License

Private - All rights reserved
# lgurd
