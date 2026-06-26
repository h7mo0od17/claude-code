// Copy Trading Engine
// Monitors master account and propagates trades to all active subscriber accounts.

import { db } from "@/lib/db"
import { getBrokerAdapter } from "@/lib/broker"
import type { PackageTier } from "@prisma/client"

// Lot size multipliers per package tier
const LOT_MULTIPLIERS: Record<PackageTier, number> = {
  BRONZE: 0.01,
  SILVER: 0.05,
  GOLD: 0.1,
}

export async function processMasterTrade(masterTradeId: string) {
  const masterTrade = await db.masterTrade.findUnique({
    where: { id: masterTradeId },
    include: { masterAccount: true },
  })

  if (!masterTrade) return

  // Find all active subscriber accounts
  const activeAccounts = await db.brokerAccount.findMany({
    where: {
      status: "ACTIVE",
      user: {
        subscription: {
          status: "ACTIVE",
        },
      },
    },
    include: {
      user: {
        include: {
          subscription: {
            include: { package: true },
          },
        },
      },
    },
  })

  const adapter = getBrokerAdapter("mt4")
  if (!adapter) return

  for (const account of activeAccounts) {
    const sub = account.user.subscription
    if (!sub?.package) continue

    const lotMultiplier = LOT_MULTIPLIERS[sub.package.tier]
    const copiedLot = Math.max(
      0.01,
      Math.round(masterTrade.lotSize.toNumber() * lotMultiplier * 100) / 100
    )

    const existing = await db.copiedTrade.findFirst({
      where: { masterTradeId, brokerAccountId: account.id },
    })
    if (existing) continue

    const copied = await db.copiedTrade.create({
      data: {
        masterTradeId,
        brokerAccountId: account.id,
        symbol: masterTrade.symbol,
        type: masterTrade.type,
        lotSize: copiedLot,
        status: "PENDING",
      },
    })

    // Decrypt credentials (in production use proper KMS)
    const credentials = {
      accountNumber: account.accountNumber,
      password: Buffer.from(account.passwordEncrypted, "base64").toString("utf8"),
      server: account.server,
    }

    const result = await adapter.copyTrade(masterTrade.ticket, credentials, copiedLot)

    await db.copiedTrade.update({
      where: { id: copied.id },
      data: {
        ticket: result.ticket,
        status: result.success ? "OPEN" : "ERROR",
        errorMessage: result.error,
        openPrice: masterTrade.openPrice,
      },
    })
  }
}

export async function closeMasterTrade(masterTradeId: string) {
  const copiedTrades = await db.copiedTrade.findMany({
    where: { masterTradeId, status: "OPEN" },
    include: { brokerAccount: true },
  })

  const adapter = getBrokerAdapter("mt4")
  if (!adapter) return

  for (const trade of copiedTrades) {
    if (!trade.ticket) continue

    const credentials = {
      accountNumber: trade.brokerAccount.accountNumber,
      password: Buffer.from(trade.brokerAccount.passwordEncrypted, "base64").toString("utf8"),
      server: trade.brokerAccount.server,
    }

    const result = await adapter.closePosition(trade.ticket, credentials)

    await db.copiedTrade.update({
      where: { id: trade.id },
      data: {
        status: result.success ? "CLOSED" : "ERROR",
        errorMessage: result.error,
        closedAt: result.success ? new Date() : undefined,
      },
    })
  }
}

export async function getClientPerformance(userId: string) {
  const brokerAccount = await db.brokerAccount.findUnique({
    where: { userId },
    include: {
      copiedTrades: {
        orderBy: { copiedAt: "desc" },
      },
    },
  })

  if (!brokerAccount) return null

  const trades = brokerAccount.copiedTrades
  const closedTrades = trades.filter((t) => t.status === "CLOSED")
  const openTrades = trades.filter((t) => t.status === "OPEN")

  const totalProfit = closedTrades.reduce(
    (sum, t) => sum + (t.profit?.toNumber() ?? 0),
    0
  )

  const winningTrades = closedTrades.filter((t) => (t.profit?.toNumber() ?? 0) > 0)

  return {
    totalTrades: trades.length,
    openTrades: openTrades.length,
    closedTrades: closedTrades.length,
    totalProfit,
    winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
    trades,
  }
}
