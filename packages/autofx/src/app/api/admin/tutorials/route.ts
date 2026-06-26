import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tutorials = await db.tutorialVideo.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
  return NextResponse.json({ tutorials })
}

const schema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  videoUrl: z.string().url(),
  category: z.string().default("general"),
  order: z.number().int().default(0),
})

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const tutorial = await db.tutorialVideo.create({ data: parsed.data })
  return NextResponse.json({ tutorial }, { status: 201 })
}
