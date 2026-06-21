export type UserRole = 'user' | 'admin'
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected'
export type Package = 'bronze' | 'silver' | 'gold'
export type PaymentStatus = 'unpaid' | 'paid'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string
  country: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  exness_uid: string
  exness_account_number: string
  account_balance: number
  account_currency: string
  status: ApplicationStatus
  package: Package | null
  package_price: number | null
  stripe_payment_link: string | null
  payment_status: PaymentStatus
  payment_confirmed_at: string | null
  mirror_active: boolean
  mirror_activated_at: string | null
  admin_notes: string
  rejection_reason: string
  reviewed_by: string | null
  reviewed_at: string | null
  submitted_at: string
  updated_at: string
}

export interface ApplicationWithProfile extends Application {
  full_name: string
  email: string
  phone: string
  country: string
}

export const PACKAGE_CONFIG = {
  bronze: {
    name: 'BronzeFX',
    price: 149,
    range: '$500 – $2,999',
    minBalance: 500,
    maxBalance: 2999,
    color: 'bronze' as const,
  },
  silver: {
    name: 'SilverFX',
    price: 399,
    range: '$3,000 – $9,999',
    minBalance: 3000,
    maxBalance: 9999,
    color: 'silver' as const,
  },
  gold: {
    name: 'GoldFX',
    price: 1499,
    range: '$10,000+',
    minBalance: 10000,
    maxBalance: Infinity,
    color: 'champagne' as const,
  },
} as const

export function getPackageForBalance(balance: number): Package | null {
  if (balance >= 10000) return 'gold'
  if (balance >= 3000) return 'silver'
  if (balance >= 500) return 'bronze'
  return null
}
