import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      phone: true,
      country: true,
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ user: { ...user, emailVerified: !!user?.emailVerified } })
}

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
})

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const user = await db.user.update({
    where: { id: session.userId },
    data: parsed.data,
    select: { name: true, email: true, phone: true, country: true },
  })

  await db.activityLog.create({
    data: { userId: session.userId, action: "PROFILE_UPDATED", result: "SUCCESS" },
  })

  return NextResponse.json({ user })
}
