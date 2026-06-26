import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const servers = await db.brokerServer.findMany({
    include: { broker: { select: { displayName: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ servers })
}

const schema = z.object({
  name: z.string().min(2).max(100),
  host: z.string().min(4).max(200),
  port: z.coerce.number().int().min(1).max(65535).default(443),
})

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!["SUPER_ADMIN", "OPERATIONS_ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  // Get default broker
  let broker = await db.broker.findFirst({ where: { isDefault: true } })
  if (!broker) {
    broker = await db.broker.create({
      data: { name: "mt4", displayName: "MetaTrader", isDefault: true },
    })
  }

  const server = await db.brokerServer.create({
    data: { ...parsed.data, brokerId: broker.id },
    include: { broker: { select: { displayName: true } } },
  })

  await db.activityLog.create({
    data: {
      adminId: session.adminId,
      action: "BROKER_SERVER_ADDED",
      details: { name: parsed.data.name },
      result: "SUCCESS",
    },
  })

  return NextResponse.json({ server }, { status: 201 })
}
