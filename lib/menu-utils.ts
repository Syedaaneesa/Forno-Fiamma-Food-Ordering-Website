import type { MenuItem, MenuOption } from '@/lib/core'

export function formatMoney(amount: number) { return `Rs ${amount.toLocaleString('en-PK')}` }
export function calculateConfiguredPrice(item: MenuItem, selection: { size?: string; variant?: string; addons?: string[] }) {
  const selectedSize = item.sizes?.find((option) => option.id === selection.size)
  const selectedVariant = item.variants?.find((option) => option.id === selection.variant)
  const selectedAddons = (selection.addons || []).map((id) => item.addons?.find((option) => option.id === id)).filter((option): option is MenuOption => Boolean(option))
  return (selectedSize?.price ?? item.price) + (selectedVariant?.price ?? 0) + selectedAddons.reduce((sum, option) => sum + option.price, 0)
}
