import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email-error", request.url))
  }

  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!verificationToken || verificationToken.type !== "EMAIL_VERIFY") {
    return NextResponse.redirect(new URL("/verify-email-error?reason=invalid", request.url))
  }

  if (verificationToken.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/verify-email-error?reason=expired", request.url))
  }

  if (verificationToken.usedAt) {
    return NextResponse.redirect(new URL("/verify-email-error?reason=used", request.url))
  }

  await db.$transaction([
    db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    }),
    db.verificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() },
    }),
    db.activityLog.create({
      data: { userId: verificationToken.userId, action: "EMAIL_VERIFIED", result: "SUCCESS" },
    }),
    db.notification.create({
      data: {
        userId: verificationToken.userId,
        type: "EMAIL_VERIFIED",
        title: "Email Verified",
        message: "Your email address has been successfully verified. You can now access all features.",
      },
    }),
  ])

  return NextResponse.redirect(new URL("/login?verified=1", request.url))
}
