# AutoFX — Deployment Guide

Complete step-by-step instructions for deploying AutoFX to production.

---

## Prerequisites

- Node.js 18+ or Bun
- A [Supabase](https://supabase.com) account (free tier works for MVP)
- A [Stripe](https://stripe.com) account
- A [Vercel](https://vercel.com) account
- A domain name (e.g. autofx.ae)

---

## 1. Supabase Setup

### 1.1 Create a Project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name (e.g. `autofx-production`), set a strong database password, select a region closest to your users.
3. Wait for the project to provision (~2 minutes).

### 1.2 Run the Schema

1. In the Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this repo
3. Paste the entire contents and click **Run**
4. Verify tables `profiles` and `applications` appear under **Table Editor**

### 1.3 Configure Auth

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your production domain: `https://autofx.ae`
3. Under **Redirect URLs**, add:
   - `https://autofx.ae/**`
   - `https://autofx.ae/auth/callback` (if you add OAuth later)
4. Go to **Authentication → Email Templates** and customise the confirmation email if desired.
5. Under **Authentication → Providers**, ensure **Email** is enabled.

### 1.4 Get Your API Keys

Go to **Settings → API**. Copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.5 Set Your Admin Account

After deploying and creating your admin account, run this SQL in the Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

Replace with your actual admin email address.

---

## 2. Stripe Setup

AutoFX uses Stripe **Payment Links** — no webhook integration required for MVP.

### 2.1 Create Payment Links

For each package, create a Stripe Payment Link:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Payment Links** → **New**
2. Create a product for each package:

| Package | Product Name | Price | Billing |
|---------|-------------|-------|---------|
| BronzeFX | AutoFX BronzeFX | $149.00 USD | Monthly recurring |
| SilverFX | AutoFX SilverFX | $399.00 USD | Monthly recurring |
| GoldFX | AutoFX GoldFX | $1,499.00 USD | Monthly recurring |

3. For each payment link:
   - Set **Collect customer details** → Name + Email
   - Optionally add a success URL: `https://autofx.ae/dashboard`
   - Click **Create Link**
4. Copy each payment link URL — you'll paste these into the Admin panel per client.

### 2.2 Admin Workflow for Payments

When a client is approved, the admin:
1. Goes to `/admin`, expands the client row
2. Sets **Status** → `Approved`, selects the correct **Package**
3. Pastes the appropriate Stripe Payment Link into the **Stripe Payment Link** field
4. Clicks **Save Changes**

The client then sees the payment link on their `/dashboard` page. Once they pay:
1. The admin clicks **Confirm Payment** in the admin panel
2. Then clicks **Activate Mirror** to start the service

---

## 3. Vercel Deployment

### 3.1 Import the Repository

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository containing this codebase
3. Set **Framework Preset** to **Next.js**
4. Leave the build command as default (`next build`)

### 3.2 Environment Variables

In Vercel **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are the only required environment variables for the MVP.

### 3.3 Deploy

Click **Deploy**. Vercel will build and deploy the app. Your site will be live at a `.vercel.app` URL initially.

### 3.4 Custom Domain

1. In Vercel → your project → **Settings → Domains**
2. Add your custom domain (e.g. `autofx.ae`)
3. Follow the DNS instructions — typically add an A record or CNAME at your domain registrar
4. SSL is provisioned automatically by Vercel

### 3.5 Update Supabase Redirect URLs

After adding your custom domain, go back to Supabase → **Authentication → URL Configuration** and ensure your domain is in the **Redirect URLs** list.

---

## 4. Post-Deployment Checklist

- [ ] Visit `https://autofx.ae` — landing page loads correctly
- [ ] Create a test user account via `/signup`
- [ ] Set that user as admin via Supabase SQL Editor
- [ ] Log in and verify `/admin` is accessible
- [ ] Submit a test application via `/apply`
- [ ] Test the full admin flow: approve → add Stripe link → confirm payment → activate mirror
- [ ] Verify the dashboard shows correct status at each stage
- [ ] Test `/exness` page — affiliate link opens correctly
- [ ] Test all legal pages: `/terms`, `/privacy`, `/risk-disclosure`, `/refund-policy`
- [ ] Test mobile responsiveness on a real device
- [ ] Verify Supabase RLS is working: non-admin users cannot see other users' applications

---

## 5. Local Development

```bash
# Install dependencies
npm install
# or
bun install

# Create local environment file
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 6. Project Structure

```
autofx/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── admin/
│   │   ├── layout.tsx          # Admin role guard
│   │   ├── page.tsx            # Server actions + data fetch
│   │   └── AdminPanel.tsx      # Client UI
│   ├── apply/page.tsx
│   ├── dashboard/page.tsx
│   ├── exness/page.tsx
│   ├── privacy/page.tsx
│   ├── refund-policy/page.tsx
│   ├── risk-disclosure/page.tsx
│   ├── terms/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── landing/               # Hero, HowItWorks, Packages, Features, CTA
│   ├── layout/                # Navbar, Footer
│   └── ui/                    # Button, Input, Badge, GlassCard
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   └── utils.ts
├── supabase/
│   └── schema.sql             # Full database schema with RLS
├── types/
│   └── index.ts               # Package config, types
├── middleware.ts               # Route protection
├── tailwind.config.ts          # Custom design tokens
└── .env.example
```

---

## 7. Key Business Logic

### Package Assignment
- $500–$2,999 → **BronzeFX** ($149/month)
- $3,000–$9,999 → **SilverFX** ($399/month)
- $10,000+ → **GoldFX** ($1,499/month)
- Below $500 → Ineligible

Package is suggested automatically by the system but assigned manually by the admin at approval time.

### Status Flow
```
Application submitted → pending
Admin reviews → under_review
Admin approves → approved (Stripe link sent to client)
Client pays → admin confirms → payment_status: paid
Admin activates → mirror_active: true → Live
```

### Admin Controls
All admin actions (approve/reject, confirm payment, activate/deactivate mirror) are performed through the `/admin` panel, which uses Next.js Server Actions for secure server-side database writes.

---

## 8. Security Notes

- The admin route (`/admin`) is protected at the layout level by a server-side role check
- Row Level Security (RLS) is enabled on all tables — users can only read/write their own data
- Stripe payment links are sent by admin only after manual verification — clients cannot self-select packages
- No Stripe webhooks or API keys are exposed on the client
- All authentication uses Supabase SSR cookies (httpOnly, secure)

---

## 9. Scaling Considerations (Post-MVP)

- **Stripe Webhooks**: For automated payment confirmation, integrate `stripe.webhooks.constructEvent` with a `/api/webhooks/stripe` route
- **Email notifications**: Use Supabase Edge Functions + Resend to send approval/rejection emails
- **Trade mirroring API**: Connect to your actual MT4/MT5 mirroring infrastructure via a separate backend service
- **Monitoring**: Add Sentry for error tracking and Vercel Analytics for page performance
