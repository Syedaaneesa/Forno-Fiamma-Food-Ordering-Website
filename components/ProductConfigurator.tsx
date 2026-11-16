'use client'

import { useMemo, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { MenuItem, MenuOption } from '@/lib/core'
import type { CartAddon, CartItem } from '@/lib/cart'
import { calculateConfiguredPrice, formatMoney } from '@/lib/menu-utils'

export default function ProductConfigurator({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: (cartItem: CartItem) => void }) {
  const [size, setSize] = useState(item.sizes?.[0]?.id)
  const [variant, setVariant] = useState(item.variants?.[0]?.id)
  const [addons, setAddons] = useState<string[]>([])
  const price = useMemo(() => calculateConfiguredPrice(item, { size, variant, addons }), [item, size, variant, addons])
  const selectedAddons: CartAddon[] = (addons.map((id) => item.addons?.find((option) => option.id === id)).filter(Boolean) as MenuOption[] || []).map((option) => ({ id: option.id, label: option.label, price: option.price }))
  function toggleAddon(id: string) { setAddons((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]) }
  function add() { const lineId = [item.id, size || 'base', variant || 'base', ...addons.sort()].join('__'); onAdd({ lineId, id: item.id, name: item.name, price, image: item.image, quantity: 1, sizeId: size, variantId: variant, size: item.sizes?.find((option) => option.id === size)?.label, variant: item.variants?.find((option) => option.id === variant)?.label, addons: selectedAddons }) }
  const options = (title: string, list: MenuOption[] | undefined, value: string | undefined, setValue: (value: string) => void) => list?.length ? <div className="option-group"><div className="option-title">{title}</div><div className="option-grid">{list.map((option) => <button type="button" key={option.id} className={`option-pill ${value === option.id ? 'selected' : ''}`} onClick={() => setValue(option.id)}><span>{option.label}</span><span>{option.price > 0 && title !== 'Size' ? `+${formatMoney(option.price)}` : formatMoney(option.price)}</span></button>)}</div></div> : null
  return <div className="cart-overlay"><button className="cart-backdrop" onClick={onClose} aria-label="Close configurator"/><aside className="cart-panel product-modal"><div className="product-modal-image"><img src={item.image} alt={item.name}/><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button></div><div className="product-modal-body"><span className="eyebrow">Build your order</span><h2 className="serif">{item.name}</h2><p className="muted">{item.description}</p>{options('Size', item.sizes, size, setSize)}{options('Variant', item.variants, variant, setVariant)}{item.addons?.length ? <div className="option-group"><div className="option-title">Add extras</div><div className="addon-list">{item.addons.map((option) => <button type="button" key={option.id} className={`addon-row ${addons.includes(option.id) ? 'selected' : ''}`} onClick={() => toggleAddon(option.id)}><span><span className="check-box">{addons.includes(option.id) && <Check size={13}/>}</span>{option.label}</span><strong>+{formatMoney(option.price)}</strong></button>)}</div></div> : null}<div className="config-footer"><strong>{formatMoney(price)}</strong><button className="button button-primary" onClick={add}><Plus size={15}/> Add to order</button></div></div></aside></div>
}
