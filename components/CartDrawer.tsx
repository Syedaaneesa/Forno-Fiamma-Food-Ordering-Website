'use client'

import { useState } from 'react'
import { Minus, Plus, Trash2, X, MessageCircle, Loader2 } from 'lucide-react'
import type { CartItem } from '@/lib/cart'
import { cartTotal } from '@/lib/cart'
import { trackFootprint } from '@/lib/footprint'
import { formatMoney } from '@/lib/menu-utils'

export function CartDrawer({ items, onClose, onChange }: { items: CartItem[]; onClose: () => void; onChange: (items: CartItem[]) => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ customerName:'', phone:'', notes:'', fulfillment:'pickup' })
  const total = cartTotal(items)
  function update(lineId: string, delta: number) { onChange(items.map((item) => item.lineId === lineId ? {...item, quantity: Math.max(0, item.quantity + delta)} : item).filter((item) => item.quantity > 0)) }
  async function submit() {
    if (!form.customerName || !form.phone || !items.length) { setState('error'); return }
    setState('sending'); trackFootprint('order_started', { total })
    const response = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, items: items.map((item) => ({ id:item.id, quantity:item.quantity, size:item.sizeId, variant:item.variantId, addons:item.addons.map((addon) => addon.id) })) }) })
    const data = await response.json()
    if (!response.ok) { setState('error'); return }
    setState('success'); trackFootprint('order_completed', { total }); window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer')
  }
  return <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Your order"><button className="cart-backdrop" onClick={onClose} aria-label="Close cart"/><aside className="cart-panel"><div className="cart-header"><div><span className="eyebrow">Your table</span><h2 className="serif" style={{margin:'6px 0 0',fontSize:31}}>Order basket</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20}/></button></div>{!items.length ? <div className="empty-cart"><span style={{fontSize:44}}>◌</span><h3 className="serif">The basket is waiting.</h3><p className="muted">Add a dish from the menu and we’ll send it straight to our kitchen team.</p></div> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.lineId}><img src={item.image} alt=""/><div style={{minWidth:0,flex:1}}><strong>{item.name}</strong><p className="muted cart-choice" style={{margin:'5px 0 10px'}}>{[item.size,item.variant,item.addons.length ? `+${item.addons.map((addon) => addon.label).join(', ')}` : ''].filter(Boolean).join(' · ') || 'Original recipe'}</p><div className="qty"><button onClick={() => update(item.lineId,-1)} aria-label="Decrease"><Minus size={13}/></button><span>{item.quantity}</span><button onClick={() => update(item.lineId,1)} aria-label="Increase"><Plus size={13}/></button></div></div><div style={{textAlign:'right'}}><strong>{formatMoney(item.price * item.quantity)}</strong><button className="remove" onClick={() => update(item.lineId,-item.quantity)} aria-label={`Remove ${item.name}`}><Trash2 size={14}/></button></div></div>)}</div><div className="cart-total"><span className="muted">Total</span><strong>{formatMoney(total)}</strong></div>{state === 'success' ? <div className="checkout-success"><MessageCircle size={26}/><strong>Order ready in WhatsApp.</strong><p className="muted">Your configured order is open in a new WhatsApp message. Send it to confirm.</p><button className="button button-ghost" onClick={onClose}>Back to menu</button></div> : <div className="checkout-form"><span className="eyebrow">Send to the kitchen</span><input className="field" placeholder="Your name" value={form.customerName} onChange={(e) => setForm({...form,customerName:e.target.value})}/><input className="field" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({...form,phone:e.target.value})}/><select className="field" value={form.fulfillment} onChange={(e) => setForm({...form,fulfillment:e.target.value as 'pickup' | 'delivery'})}><option value="pickup">Pickup from the restaurant</option><option value="delivery">Delivery request</option></select><textarea className="field" rows={3} placeholder="Notes for the team (optional)" value={form.notes} onChange={(e) => setForm({...form,notes:e.target.value})}/>{state === 'error' && <p style={{color:'var(--danger)',fontSize:13,margin:0}}>Please add your name and phone number before sending.</p>}<button className="button button-primary" onClick={submit} disabled={state==='sending'}>{state === 'sending' ? <><Loader2 className="spin" size={16}/> Preparing…</> : <><MessageCircle size={16}/> Send order on WhatsApp</>}</button></div>}</>}</aside></div>
}
