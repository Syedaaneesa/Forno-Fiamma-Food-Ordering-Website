import { getSessionFromRequest } from '@/lib/core'

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request)
  if (!session) return Response.json({ user: null }, { status: 401 })
  return Response.json({ user: { id: session.sub, name: session.name, email: session.email, role: session.role } })
}
