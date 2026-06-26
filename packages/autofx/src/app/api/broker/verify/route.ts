import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { MT4Adapter } from "@/lib/broker/mt4"
import { encryptPassword } from "@/lib/utils"

const schema = z.object({
  accountNumber: z.string().min(4).max(20),
  password: z.string().min(1),
  server: z.string().min(1),
  brokerId: z.string().default("mt4"),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { accountNumber, password, server, brokerId } = parsed.data

    // Verify user has an active subscription
    const subscription = await db.subscription.findUnique({
      where: { userId: session.userId },
      include: { package: true },
    })

    if (!subscription || !["PENDING_PAYMENT", "ACTIVE"].includes(subscription.status)) {
      return NextResponse.json(
        { error: "You need an active subscription to connect a broker account." },
        { status: 400 }
      )
    }

    if (subscription.status === "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Please complete payment before connecting your broker account." },
        { status: 400 }
      )
    }

    // Verify with broker
    const result = await MT4Adapter.verify({ accountNumber, password, server })

    if (!result.success) {
      await db.activityLog.create({
        data: {
          userId: session.userId,
          action: "BROKER_VERIFY_FAILED",
          details: { error: result.error, server },
          result: "FAILED",
        },
      })
      return NextResponse.json({ success: false, error: result.error }, { status: 200 })
    }

    const accountInfo = result.accountInfo!

    // Check minimum deposit
    const minDeposit = subscription.package.minDeposit.toNumber()
    if (accountInfo.balance < minDeposit) {
      return NextResponse.json({
        success: false,
        error: `Insufficient balance. Your ${subscription.package.name} package requires a minimum deposit of $${minDeposit.toLocaleString()}. Current balance: $${accountInfo.balance.toLocaleString()}.`,
        currentBalance: accountInfo.balance,
        requiredBalance: minDeposit,
      })
    }

    // Get default broker
    let broker = await db.broker.findFirst({ where: { isDefault: true } })
    if (!broker) {
      broker = await db.broker.upsert({
        where: { name: brokerId },
        update: {},
        create: {
          name: brokerId,
          displayName: "MetaTrader",
          isDefault: true,
        },
      })
    }

    // Save broker account
    const encryptedPassword = encryptPassword(password)

    const brokerAccount = await db.brokerAccount.upsert({
      where: { userId: session.userId },
      update: {
        accountNumber,
        passwordEncrypted: encryptedPassword,
        server,
        brokerId: broker.id,
        accountName: accountInfo.name,
        currency: accountInfo.currency,
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        leverage: accountInfo.leverage,
        status: "VERIFIED",
        verifiedAt: new Date(),
        verificationError: null,
      },
      create: {
        userId: session.userId,
        brokerId: broker.id,
        accountNumber,
        passwordEncrypted: encryptedPassword,
        server,
        accountName: accountInfo.name,
        currency: accountInfo.currency,
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        leverage: accountInfo.leverage,
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    })

    // Activate the subscription
    await db.$transaction([
      db.subscription.update({
        where: { id: subscription.id },
        data: { status: "ACTIVE", activatedAt: new Date() },
      }),
      db.brokerAccount.update({
        where: { id: brokerAccount.id },
        data: { status: "ACTIVE" },
      }),
      db.notification.create({
        data: {
          userId: session.userId,
          type: "BROKER_CONNECTED",
          title: "Copy Trading Activated!",
          message: `Your broker account ${accountNumber} has been verified and copy trading is now active.`,
        },
      }),
      db.activityLog.create({
        data: {
          userId: session.userId,
          action: "BROKER_CONNECTED",
          details: { accountNumber, server, balance: accountInfo.balance },
          result: "SUCCESS",
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      accountInfo,
      message: "Broker account verified and copy trading activated!",
    })
  } catch (err) {
    console.error("[broker/verify]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
