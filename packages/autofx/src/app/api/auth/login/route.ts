import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifyPassword, createUserSession } from "@/lib/auth"
import { TOTP } from "otpauth"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  otp: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { email, password, otp } = parsed.data

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      await db.activityLog.create({
        data: { userId: user.id, action: "LOGIN_FAILED", result: "FAILED" },
      })
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Your account has been suspended. Please contact support." }, { status: 403 })
    }

    // 2FA check
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!otp) {
        return NextResponse.json({ requiresOTP: true }, { status: 200 })
      }
      const totp = new TOTP({ secret: user.twoFactorSecret })
      const valid = totp.validate({ token: otp, window: 1 })
      if (valid === null) {
        return NextResponse.json({ error: "Invalid two-factor code" }, { status: 401 })
      }
    }

    const token = await createUserSession(user.id, user.email)

    await db.activityLog.create({
      data: { userId: user.id, action: "LOGIN", result: "SUCCESS" },
    })

    const response = NextResponse.json({ success: true }, { status: 200 })
    response.cookies.set("autofx-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
