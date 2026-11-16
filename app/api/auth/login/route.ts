import { fallback, hashPassword, jsonError, prisma, createSessionToken, sessionCookieOptions, verifyPassword } from '@/lib/core'
import { cookies } from 'next/headers'
import { z } from 'zod'

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) })

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return jsonError('Enter your admin email and password.')
  const email = parsed.data.email.toLowerCase()
  let user: { id: string; name: string; email: string; passwordHash: string; role: string } | null = null
  if (prisma) user = await prisma.adminUser.findUnique({ where: { email } }).catch(() => null)
  if (!user) user = fallback.admins.find((admin) => admin.email === email) || null
  if (!user || user.role !== 'SUPERADMIN' || !(await verifyPassword(parsed.data.password, user.passwordHash))) return jsonError('The email or password is incorrect.', 401)
  const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name, role: 'SUPERADMIN' })
  const cookieStore = await cookies(); cookieStore.set('forno_session', token, sessionCookieOptions())
  return Response.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}
