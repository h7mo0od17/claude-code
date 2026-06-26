import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "autofx-dev-secret-change-in-production"
)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export type SessionPayload = {
  userId: string
  email: string
  sessionId: string
}

export type AdminSessionPayload = {
  adminId: string
  email: string
  role: string
  sessionId: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUserSession(userId: string, email: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await db.session.create({
    data: { userId, token: sessionId, expiresAt },
  })

  const token = await new SignJWT({ userId, email, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  return token
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const session = await db.session.findUnique({
      where: { token: payload.sessionId as string },
    })
    if (!session || session.expiresAt < new Date()) return null
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("autofx-session")?.value
  if (!token) return null
  return verifySession(token)
}

export async function createAdminSession(
  adminId: string,
  email: string,
  role: string
): Promise<string> {
  const sessionId = crypto.randomUUID()
  const token = await new SignJWT({ adminId, email, role, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(JWT_SECRET)
  return token
}

export async function verifyAdminSession(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.adminId) return null
    return payload as unknown as AdminSessionPayload
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("autofx-admin-session")?.value
  if (!token) return null
  return verifyAdminSession(token)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
