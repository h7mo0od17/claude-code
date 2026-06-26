// MT4/MT5 broker adapter
// In production, this would use a MetaTrader Manager API, FIX protocol, or
// a bridge service that connects to MT4/MT5 servers.
// This implementation provides the full interface with a validation stub.

import type { BrokerAdapter, BrokerCredentials, AccountInfo, VerificationResult } from "./index"

const MT4_BRIDGE_URL = process.env.MT4_BRIDGE_URL ?? ""
const MT4_BRIDGE_API_KEY = process.env.MT4_BRIDGE_API_KEY ?? ""

async function callBridge(endpoint: string, body: Record<string, unknown>) {
  if (!MT4_BRIDGE_URL) {
    // Stub mode: simulate verification for development/demo
    return null
  }
  const res = await fetch(`${MT4_BRIDGE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": MT4_BRIDGE_API_KEY,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Bridge error: ${res.status}`)
  return res.json()
}

export const MT4Adapter: BrokerAdapter = {
  name: "MetaTrader 4/5",

  async verify(credentials: BrokerCredentials): Promise<VerificationResult> {
    try {
      const result = await callBridge("/verify", credentials)

      if (!result) {
        // Stub mode: perform basic validation
        if (!credentials.accountNumber || credentials.accountNumber.length < 4) {
          return { success: false, error: "Invalid account number format." }
        }
        if (!credentials.password || credentials.password.length < 4) {
          return { success: false, error: "Password is too short." }
        }
        if (!credentials.server) {
          return { success: false, error: "Server is required." }
        }
        // In stub mode, simulate a successful verification
        return {
          success: true,
          accountInfo: {
            accountNumber: credentials.accountNumber,
            name: "Demo Account",
            currency: "USD",
            balance: 5000,
            equity: 5000,
            leverage: 100,
            server: credentials.server,
          },
        }
      }

      return {
        success: result.success,
        error: result.error,
        accountInfo: result.accountInfo,
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Connection failed. Please try again.",
      }
    }
  },

  async getAccountInfo(credentials: BrokerCredentials): Promise<AccountInfo | null> {
    try {
      const result = await callBridge("/account-info", credentials)
      if (!result) return null
      return result as AccountInfo
    } catch {
      return null
    }
  },

  async copyTrade(masterTicket, credentials, lotSize) {
    try {
      const result = await callBridge("/copy-trade", {
        masterTicket,
        credentials,
        lotSize,
      })
      if (!result) {
        // Stub: simulate successful copy
        return { success: true, ticket: `${Date.now()}` }
      }
      return result as { success: boolean; ticket?: string; error?: string }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Trade copy failed",
      }
    }
  },

  async closePosition(ticket, credentials) {
    try {
      const result = await callBridge("/close-position", { ticket, credentials })
      if (!result) return { success: true }
      return result as { success: boolean; error?: string }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Close position failed",
      }
    }
  },
}
