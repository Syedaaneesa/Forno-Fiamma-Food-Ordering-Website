export type CartAddon = { id: string; label: string; price: number }
export type CartItem = { lineId: string; id: string; name: string; price: number; image: string; quantity: number; size?: string; sizeId?: string; variant?: string; variantId?: string; addons: CartAddon[] }
export function cartTotal(items: CartItem[]) { return items.reduce((sum, item) => sum + item.price * item.quantity, 0) }
export function cartCount(items: CartItem[]) { return items.reduce((sum, item) => sum + item.quantity, 0) }
