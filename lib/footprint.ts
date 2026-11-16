"use client"
export function trackFootprint(event: 'page_view' | 'menu_view' | 'add_to_cart' | 'cart_open' | 'order_started' | 'order_completed', metadata: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return
  fetch('/api/footprint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, path: window.location.pathname, referrer: document.referrer, metadata }), keepalive: true }).catch(() => undefined)
}
