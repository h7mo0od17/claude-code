import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const items = await db.faqItem.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
  return NextResponse.json({ items })
}

const schema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(10).max(5000),
  category: z.string().default("general"),
  order: z.number().int().default(0),
})

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const item = await db.faqItem.create({ data: parsed.data })
  return NextResponse.json({ item }, { status: 201 })
}
