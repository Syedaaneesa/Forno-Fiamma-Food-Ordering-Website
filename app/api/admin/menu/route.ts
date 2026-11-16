import { getMenu, getSessionFromRequest, jsonError, prisma, fallback } from '@/lib/core'
import { z } from 'zod'

const optionSchema = z.object({ id: z.string(), label: z.string(), price: z.number().int().min(-5000).max(5000) })
const menuSchema = z.object({ id: z.string().optional(), name: z.string().trim().min(2).max(80), slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/), description: z.string().trim().min(5).max(300), price: z.number().int().min(1).max(10000), image: z.string().trim().min(1).max(300), tag: z.string().trim().min(2).max(40), category: z.string().trim().min(2).max(60).default('Pizza'), sizes: z.array(optionSchema).optional(), variants: z.array(optionSchema).optional(), addons: z.array(optionSchema).optional(), featured: z.boolean().default(false), isDeal: z.boolean().default(false), active: z.boolean().default(true) })

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request)
  if (!session) return jsonError('Unauthorized', 401)
  const parsed = menuSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return jsonError('Please complete all menu fields.')
  const data = parsed.data
  if (prisma) {
    try {
      const item = data.id ? await prisma.menuItem.update({ where: { id: data.id }, data: { ...data, id: undefined } }) : await prisma.menuItem.create({ data: { ...data, id: undefined } })
      return Response.json({ ok: true, item })
    } catch (error) { return jsonError('Menu item could not be saved. Check that the slug is unique.', 409) }
  }
  const index = fallback.menu.findIndex((item) => item.id === data.id || item.slug === data.slug)
  const item = { id: data.id || data.slug, ...data }
  if (index >= 0) fallback.menu[index] = item
  else fallback.menu.push(item)
  return Response.json({ ok: true, item })
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request)
  if (!session) return jsonError('Unauthorized', 401)
  return Response.json({ menu: await getMenu(true) })
}
