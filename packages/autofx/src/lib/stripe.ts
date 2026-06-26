import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-11-20.acacia",
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ""

export const PACKAGES = {
  BRONZE: {
    name: "BronzeFX",
    tier: "BRONZE" as const,
    monthlyPrice: 49,
    minDeposit: 500,
    features: [
      "Automatic trade copying",
      "Real-time trade execution",
      "Performance dashboard",
      "Email notifications",
      "Basic support",
    ],
  },
  SILVER: {
    name: "SilverFX",
    tier: "SILVER" as const,
    monthlyPrice: 99,
    minDeposit: 3000,
    features: [
      "Everything in BronzeFX",
      "Priority trade execution",
      "Advanced analytics",
      "Priority support",
      "Monthly performance report",
    ],
  },
  GOLD: {
    name: "GoldFX",
    tier: "GOLD" as const,
    monthlyPrice: 199,
    minDeposit: 10000,
    features: [
      "Everything in SilverFX",
      "Dedicated account manager",
      "Custom risk settings",
      "VIP support 24/7",
      "Exclusive trading signals",
    ],
  },
}

export type PackageTier = keyof typeof PACKAGES
