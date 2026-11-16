import { fallback, footprintSchema, prisma } from '@/lib/core'

export async function POST(request: Request) {
  const parsed = footprintSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 })
  const data = parsed.data
  if (prisma) {
    try {
      await prisma.footprintEvent.create({ data: { event: data.event, path: data.path, referrer: data.referrer, metadata: data.metadata } })
    } catch (error) {
      console.warn('Footprint persistence unavailable; keeping an in-process operational record.', error)
      fallback.footprint.unshift({ ...data, createdAt: new Date().toISOString() })
    }
  } else {
    fallback.footprint.unshift({ ...data, createdAt: new Date().toISOString() })
  }
  return Response.json({ ok: true })
}
