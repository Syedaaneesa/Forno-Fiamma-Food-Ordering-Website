import { fallback, jsonError, leadSchema, prisma } from '@/lib/core'

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return jsonError('Please include your name, email, and enquiry.')
  const data = parsed.data
  let id = `lead-${Date.now().toString(36)}`
  if (prisma) {
    try {
      const lead = await prisma.lead.create({ data })
      id = lead.id
    } catch (error) {
      console.warn('Lead persistence unavailable; keeping an in-process operational record.', error)
      fallback.leads.unshift({ id, ...data, status: 'NEW', createdAt: new Date().toISOString() })
    }
  } else {
    fallback.leads.unshift({ id, ...data, status: 'NEW', createdAt: new Date().toISOString() })
  }
  return Response.json({ ok: true, id })
}
