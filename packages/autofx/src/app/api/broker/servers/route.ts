import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const servers = await db.brokerServer.findMany({
    where: { isActive: true },
    include: { broker: { select: { displayName: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ servers })
}
