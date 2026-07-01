# Mekseb — Save together. Grow together.

Full-stack community savings platform built with Next.js 14 App Router, TypeScript & CSS Modules.

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📄 All Pages

| Route | Page |
|-------|------|
| `/` | Landing page (Hero, Features, How it works, Network, Testimonials, CTA) |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |
| `/auth/forgot-password` | Reset password |
| `/onboarding` | 3-step onboarding flow |
| `/dashboard` | Overview — metrics + payment table |
| `/dashboard/savings` | Savings chart + circle breakdown |
| `/dashboard/groups` | My circles |
| `/dashboard/group` | Individual group detail + members |
| `/dashboard/payments` | Transaction history |
| `/dashboard/network` | Community network — find people |
| `/dashboard/requests` | Join requests — accept/decline |
| `/dashboard/notifications` | Alerts + notifications |
| `/dashboard/create` | Create a new circle (3-step form) |
| `/dashboard/policy` | Group policy |
| `/dashboard/settings` | Account, security, notifications, payment |
| `/profile` | User public profile |
| `*` | 404 page |

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (no Tailwind needed)
- **Fonts**: Inter + Space Grotesk (Google Fonts)

## 🔌 AWS Backend Integration Points

- **Auth**: Replace `setTimeout` in login/signup with AWS Cognito `signIn`/`signUp`
- **Database**: AWS RDS (PostgreSQL) or DynamoDB for groups, payments, members
- **Payments**: Stripe for card processing
- **Notifications**: AWS SES (email) + SNS (SMS)
- **Storage**: AWS S3 for profile photos
- **API**: AWS API Gateway + Lambda or Next.js API routes

## 📁 Structure

```
mekseb/
├── app/
│   ├── auth/           # Login, signup, forgot password
│   ├── onboarding/     # 3-step new user flow
│   ├── dashboard/      # All dashboard pages
│   ├── profile/        # User profile
│   └── not-found.tsx   # 404
├── components/
│   ├── ui/             # Button, Input, Toggle, Avatar, Badge, Card...
│   ├── landing/        # Nav, Hero, Features, HowItWorks, Network...
│   └── dashboard/      # MetricCard, DataTable, PageHeader...
└── public/
```
