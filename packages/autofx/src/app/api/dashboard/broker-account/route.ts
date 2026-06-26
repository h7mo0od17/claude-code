import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const brokerAccount = await db.brokerAccount.findUnique({
    where: { userId: session.userId },
    select: {
      accountNumber: true,
      server: true,
      status: true,
      accountName: true,
      balance: true,
      equity: true,
      leverage: true,
      verifiedAt: true,
      currency: true,
    },
  })

  return NextResponse.json({ brokerAccount })
}
