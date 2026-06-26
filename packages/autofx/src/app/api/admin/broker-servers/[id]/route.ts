import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!["SUPER_ADMIN", "OPERATIONS_ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { id } = await params

  await db.brokerServer.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
