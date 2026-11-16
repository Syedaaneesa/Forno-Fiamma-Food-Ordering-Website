import { cookies } from 'next/headers'
import { sessionCookieOptions } from '@/lib/core'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('forno_session', '', { ...sessionCookieOptions(), maxAge: 0 })
  return Response.json({ ok: true })
}
