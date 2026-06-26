import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/email"

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/\d/),
  defaultPackage: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: "PENDING_VERIFICATION",
      },
    })

    // Create verification token
    const token = crypto.randomUUID()
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    // Log activity
    await db.activityLog.create({
      data: { userId: user.id, action: "REGISTER", result: "SUCCESS" },
    })

    // Send verification email
    await sendVerificationEmail(email, name, token)

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (err) {
    console.error("[register]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
