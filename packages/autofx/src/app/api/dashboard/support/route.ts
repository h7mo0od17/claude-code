import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tickets = await db.supportTicket.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  })

  return NextResponse.json({ tickets })
}

const createSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const ticket = await db.supportTicket.create({
    data: {
      userId: session.userId,
      subject: parsed.data.subject,
      priority: parsed.data.priority,
      messages: {
        create: {
          senderId: session.userId,
          senderType: "CLIENT",
          message: parsed.data.message,
        },
      },
    },
  })

  return NextResponse.json({ ticket }, { status: 201 })
}
