import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifyPassword, createAdminSession } from "@/lib/auth"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

    const { email, password } = parsed.data

    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const valid = await verifyPassword(password, admin.passwordHash)
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    if (admin.status !== "ACTIVE") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 })
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    await db.activityLog.create({
      data: { adminId: admin.id, action: "ADMIN_LOGIN", result: "SUCCESS" },
    })

    const token = await createAdminSession(admin.id, admin.email, admin.role)

    const response = NextResponse.json({ success: true })
    response.cookies.set("autofx-admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/",
    })

    return response
  } catch (err) {
    console.error("[admin/login]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
