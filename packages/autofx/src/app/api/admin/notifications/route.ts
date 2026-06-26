import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

const schema = z.object({
  title: z.string().min(2).max(200),
  message: z.string().min(5).max(2000),
  type: z.enum(["SYSTEM_ANNOUNCEMENT"]).default("SYSTEM_ANNOUNCEMENT"),
  target: z.enum(["all"]).default("all"),
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

  const users = await db.user.findMany({ select: { id: true } })

  await db.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type: "SYSTEM_ANNOUNCEMENT",
      title: parsed.data.title,
      message: parsed.data.message,
    })),
  })

  await db.activityLog.create({
    data: {
      adminId: session.adminId,
      action: "NOTIFICATION_SENT",
      details: { title: parsed.data.title, recipients: users.length },
      result: "SUCCESS",
    },
  })

  return NextResponse.json({ success: true, recipients: users.length })
}
