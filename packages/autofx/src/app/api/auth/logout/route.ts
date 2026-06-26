import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST() {
  const session = await getSession()

  if (session) {
    await db.session.deleteMany({ where: { userId: session.userId } })
    await db.activityLog.create({
      data: { userId: session.userId, action: "LOGOUT", result: "SUCCESS" },
    })
  }

  const response = NextResponse.json({ success: true })
  const cookieStore = await cookies()
  cookieStore.delete("autofx-session")
  return response
}
