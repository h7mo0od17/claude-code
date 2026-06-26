// Broker integration abstraction layer.
// V1 supports one approved broker. Architecture designed for multi-broker expansion.

export interface BrokerCredentials {
  accountNumber: string
  password: string
  server: string
}

export interface AccountInfo {
  accountNumber: string
  name: string
  currency: string
  balance: number
  equity: number
  leverage: number
  server: string
}

export interface VerificationResult {
  success: boolean
  error?: string
  accountInfo?: AccountInfo
}

export interface BrokerAdapter {
  name: string
  verify(credentials: BrokerCredentials): Promise<VerificationResult>
  getAccountInfo(credentials: BrokerCredentials): Promise<AccountInfo | null>
  copyTrade(
    masterTicket: string,
    credentials: BrokerCredentials,
    lotSize: number
  ): Promise<{ success: boolean; ticket?: string; error?: string }>
  closePosition(
    ticket: string,
    credentials: BrokerCredentials
  ): Promise<{ success: boolean; error?: string }>
}

// Broker registry — add new brokers here in future versions
const brokerRegistry = new Map<string, BrokerAdapter>()

export function registerBroker(id: string, adapter: BrokerAdapter) {
  brokerRegistry.set(id, adapter)
}

export function getBrokerAdapter(brokerId: string): BrokerAdapter | undefined {
  return brokerRegistry.get(brokerId)
}

export function getDefaultBroker(): BrokerAdapter | undefined {
  return brokerRegistry.values().next().value
}

// Load the default broker adapter
import("./mt4").then((m) => {
  registerBroker("mt4", m.MT4Adapter)
})

export const DEFAULT_BROKER_ID = "mt4"
