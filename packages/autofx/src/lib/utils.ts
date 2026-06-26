import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDatetime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber
  return "•".repeat(accountNumber.length - 4) + accountNumber.slice(-4)
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
  return `AFX-${year}${month}-${random}`
}

export function encryptPassword(password: string): string {
  // Simple base64 encoding — in production use proper KMS/encryption
  return Buffer.from(password).toString("base64")
}

export function decryptPassword(encrypted: string): string {
  return Buffer.from(encrypted, "base64").toString("utf8")
}
