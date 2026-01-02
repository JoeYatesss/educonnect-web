# EduConnect Web (Frontend)

Next.js TypeScript frontend for the EduConnect teacher recruitment platform.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context API
- **Forms:** React Hook Form + Zod
- **Auth:** Supabase Auth
- **Payments:** Stripe Checkout

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for auth and database)
- Stripe account (for payments)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your credentials:
   - Supabase URL and anon key
   - Stripe publishable key
   - Backend API URL

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (marketing)/       # Public pages (landing, blog)
│   ├── (teacher-dashboard)/ # Teacher dashboard
│   └── (admin-dashboard)/ # Admin dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── dashboard/        # Dashboard components
│   └── admin/            # Admin components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
│   ├── supabase/        # Supabase client
│   ├── stripe/          # Stripe client
│   └── validations.ts   # Zod schemas
├── types/                # TypeScript types
└── middleware.ts         # Next.js middleware (auth)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.local.example` for required environment variables.

**Security:** Never commit `.env.local` to version control.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy

## Key Features

- **Authentication:** Email/password with Supabase Auth
- **Payment Gate:** Stripe Checkout for school access
- **Teacher Dashboard:** Profile, matches, applications
- **Admin Dashboard:** Teacher management, school matching
- **Anonymous Matches:** Teachers see location/salary but not school names

## Security

- All routes protected by Next.js middleware
- JWT validation on protected routes
- Rate limiting via backend API
- Input validation with Zod
- CORS configured for specific origins only

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Stripe Documentation](https://stripe.com/docs)
