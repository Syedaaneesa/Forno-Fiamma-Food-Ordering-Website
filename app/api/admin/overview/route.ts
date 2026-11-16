import { fallback, getMenu, getSessionFromRequest, prisma, jsonError } from '@/lib/core'

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request)
  if (!session) return jsonError('Unauthorized', 401)
  if (prisma) {
    try {
      const [menu, orders, leads, footprint, totals] = await Promise.all([
        prisma.menuItem.findMany({ orderBy: { createdAt: 'asc' } }),
        prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 30 }),
        prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
        prisma.footprintEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
        prisma.order.aggregate({ _count: { _all: true }, _sum: { total: true } }),
      ])
      return Response.json({ menu, orders, leads, footprint, metrics: { orders: totals._count._all, revenue: totals._sum.total || 0, leads: leads.length, visits: footprint.filter((event) => event.event === 'page_view').length } })
    } catch (error) {
      console.warn('Admin database unavailable; serving in-process operational records.', error)
    }
  }
  return Response.json({ menu: await getMenu(true), orders: fallback.orders, leads: fallback.leads, footprint: fallback.footprint, metrics: { orders: fallback.orders.length, revenue: fallback.orders.reduce((sum, order) => sum + Number(order.total || 0), 0), leads: fallback.leads.length, visits: fallback.footprint.filter((event) => event.event === 'page_view').length } })
}
