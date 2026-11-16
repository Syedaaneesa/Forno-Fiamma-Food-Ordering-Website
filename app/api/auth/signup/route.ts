import { fallback, hashPassword, jsonError, prisma, createSessionToken, sessionCookieOptions } from '@/lib/core'
import { cookies } from 'next/headers'
import { z } from 'zod'

const signupSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(120), password: z.string().min(8).max(120), signupCode: z.string().optional().default('') })

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return jsonError('Use a name, valid email, and password of at least 8 characters.')
  const { name, email, password, signupCode } = parsed.data
  const normalizedEmail = email.toLowerCase()
  const existingCount = prisma ? await prisma.adminUser.count().catch(() => fallback.admins.length) : fallback.admins.length
  if (existingCount > 0 && process.env.ADMIN_SIGNUP_CODE && signupCode !== process.env.ADMIN_SIGNUP_CODE) return jsonError('An admin signup code is required for additional accounts.', 403)
  const passwordHash = await hashPassword(password)
  let id = `admin-${Date.now().toString(36)}`
  if (prisma) {
    try { const user = await prisma.adminUser.create({ data: { name, email: normalizedEmail, passwordHash } }); id = user.id } catch { return jsonError('That email is already registered.', 409) }
  } else {
    if (fallback.admins.some((admin) => admin.email === normalizedEmail)) return jsonError('That email is already registered.', 409)
    fallback.admins.push({ id, name, email: normalizedEmail, passwordHash, role: 'SUPERADMIN' })
  }
  const token = await createSessionToken({ sub: id, email: normalizedEmail, name, role: 'SUPERADMIN' })
  const cookieStore = await cookies(); cookieStore.set('forno_session', token, sessionCookieOptions())
  return Response.json({ ok: true, user: { id, name, email: normalizedEmail, role: 'SUPERADMIN' } })
}
