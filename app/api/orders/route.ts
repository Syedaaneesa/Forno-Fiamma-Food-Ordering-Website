import { getMenu, jsonError, orderSchema, prisma, fallback } from '@/lib/core'
import { calculateConfiguredPrice } from '@/lib/menu-utils'

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return jsonError('Please check the order details and try again.')
  const { customerName, phone, notes, fulfillment, items } = parsed.data
  const menu = await getMenu()
  const lookup = new Map(menu.map((item) => [item.id, item]))
  const configured = items.map((selection) => {
    const menuItem = lookup.get(selection.id)
    if (!menuItem) return null
    const size = menuItem.sizes?.find((option) => option.id === selection.size)
    const variant = menuItem.variants?.find((option) => option.id === selection.variant)
    const addons = (selection.addons || []).map((id) => menuItem.addons?.find((option) => option.id === id)).filter((option): option is NonNullable<typeof option> => Boolean(option))
    if (selection.size && !size) return null
    if (selection.variant && !variant) return null
    if (addons.length !== (selection.addons || []).length) return null
    const unitPrice = calculateConfiguredPrice(menuItem, selection)
    return { menuItem, quantity: selection.quantity, size, variant, addons, unitPrice }
  })
  if (configured.some((item) => !item)) return jsonError('One of the selected options is no longer available.')
  const validItems = configured.filter((item): item is NonNullable<typeof item> => Boolean(item))
  const total = validItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const orderId = `FF-${Date.now().toString(36).toUpperCase()}`
  const payload = { customerName, phone, notes, fulfillment, total, status: 'NEW', items: validItems.map((item) => ({ menuItemId: item.menuItem.id, name: item.menuItem.name, quantity: item.quantity, unitPrice: item.unitPrice, size: item.size?.label, variant: item.variant?.label, addons: item.addons })) }

  if (prisma) {
    try { await prisma.order.create({ data: { id: orderId, customerName, phone, notes, fulfillment, total, items: { create: payload.items } } }) }
    catch (error) { console.warn('Order persistence unavailable; keeping an in-process operational record.', error); fallback.orders.unshift({ id: orderId, ...payload, createdAt: new Date().toISOString() }) }
  } else fallback.orders.unshift({ id: orderId, ...payload, createdAt: new Date().toISOString() })

  const lines = [`Hello Forno & Fiamma — new order ${orderId}`, '', ...validItems.map((item) => {
    const choices = [item.size?.label, item.variant?.label, item.addons.length ? `Extras: ${item.addons.map((addon) => addon.label).join(', ')}` : ''].filter(Boolean).join(' · ')
    return `${item.quantity} × ${item.menuItem.name}${choices ? ` (${choices})` : ''} — ${formatMoney(item.unitPrice * item.quantity)}`
  }), '', `Total: ${formatMoney(total)}`, `Fulfillment: ${fulfillment}`, `Name: ${customerName}`, `Phone: ${phone}`, notes ? `Notes: ${notes}` : ''].filter(Boolean).join('\n')
  const whatsappNumber = (process.env.WHATSAPP_NUMBER || '17185550142').replace(/\D/g, '')
  return Response.json({ ok: true, orderId, whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`, total })
}

function formatMoney(amount: number) { return `Rs ${amount.toLocaleString('en-PK')}` }
