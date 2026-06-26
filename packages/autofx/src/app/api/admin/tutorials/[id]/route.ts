import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.tutorialVideo.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
