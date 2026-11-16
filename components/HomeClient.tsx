'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Clock3, Flame, MapPin, Menu as MenuIcon, MessageCircle, Phone, Search, ShoppingBag, Wheat, X } from 'lucide-react'
import type { MenuItem } from '@/lib/core'
import { formatMoney } from '@/lib/menu-utils'
import type { CartItem } from '@/lib/cart'
import { cartCount } from '@/lib/cart'
import { trackFootprint } from '@/lib/footprint'
import { CartDrawer } from '@/components/CartDrawer'
import { LeadForm } from '@/components/LeadForm'
import ProductConfigurator from '@/components/ProductConfigurator'

const categoryOrder = ['All', 'Deals', 'Pizza', 'Burgers', 'Snacks', 'Crunch & Broast', 'Biryani', 'Curries', 'Value Meals', 'Extras']

export default function HomeClient({ menu }: { menu: MenuItem[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [configuring, setConfiguring] = useState<MenuItem | null>(null)
  useEffect(() => { const saved = window.localStorage.getItem('forno-cart'); if (saved) setCart(JSON.parse(saved)); trackFootprint('page_view') }, [])
  useEffect(() => { window.localStorage.setItem('forno-cart', JSON.stringify(cart)) }, [cart])
  const count = cartCount(cart)
  const categories = categoryOrder.filter((category) => category === 'All' || category === 'Deals' || menu.some((item) => item.category === category))
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = activeCategory === 'All' || (activeCategory === 'Deals' ? item.isDeal : item.category === activeCategory)
    const query = searchQuery.trim().toLocaleLowerCase()
    const matchesSearch = !query || [item.name, item.description, item.category, item.tag].filter(Boolean).some((value) => value!.toLocaleLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })
  const cartLabel = useMemo(() => count === 1 ? '1 item' : `${count} items`, [count])
  function addToCart(item: CartItem) { setCart((current) => { const found = current.find((entry) => entry.lineId === item.lineId); return found ? current.map((entry) => entry.lineId === item.lineId ? {...entry, quantity: entry.quantity + 1} : entry) : [...current, item] }); trackFootprint('add_to_cart', { item: item.name, price: item.price }); setConfiguring(null); setCartOpen(true) }
  return <main><header className="nav"><div className="container nav-inner"><a href="#top" className="brand serif">Forno<span>&</span>Fiamma</a><nav className="nav-links"><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#contact">Contact</a></nav><div className="nav-actions"><button className="cart-button" onClick={() => {setCartOpen(true);trackFootprint('cart_open')}}><ShoppingBag size={15}/> {cartLabel}</button><button className="icon-button mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={19}/> : <MenuIcon size={19}/>}</button></div></div>{mobileOpen && <div className="mobile-menu"><a href="#menu" onClick={() => setMobileOpen(false)}>Menu</a><a href="#story" onClick={() => setMobileOpen(false)}>Our story</a><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></div>}</header>
    <section className="hero" id="top"><div className="hero-image"/><div className="container hero-content"><span className="eyebrow">Freshly fired · family sized · made to order</span><h1 className="serif">Big flavours,<br/><em>one table.</em></h1><p>From cheesy pizza and juicy burgers to biryani, broast, curries and value meals — build your order exactly the way you like it.</p><div className="hero-actions"><a href="#menu" className="button button-primary">Explore the menu <ArrowDown size={15}/></a><a href="#story" className="button button-ghost">Our story <ArrowUpRight size={15}/></a></div></div><div className="container scroll-cue">Scroll to discover</div></section>
    <section id="menu" className="section"><div className="container"><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:25,marginBottom:28}}><div><span className="eyebrow">Saffa-style menu</span><h2 className="section-title">Choose your <em>flavour.</em></h2></div><p className="muted menu-intro">Choose a size, pick a variety, then add a cold drink, fries, chutney or dip before you add it to your basket.</p></div><div className="menu-sticky-tools"><label className="menu-search"><Search size={18} aria-hidden="true"/><input aria-label="Search menu" placeholder="Search dishes, ingredients…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}/>{searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={16}/></button>}</label>
    <div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => {setActiveCategory(category);trackFootprint('menu_view',{category})}}>{category === 'Deals' ? 'Deals & combos' : category}</button>)}</div></div>
    {filteredMenu.length ? <div className="menu-grid">{filteredMenu.map((item) => <article className="menu-card shine" key={item.id}><div className="menu-photo"><img src={item.image} alt={item.name}/><span className="menu-tag">{item.isDeal ? 'Deal' : item.tag}</span></div><div className="menu-body"><div className="menu-head"><h3 className="menu-name">{item.name}</h3><span className="menu-price">{formatMoney(item.price)}</span></div><p>{item.description}</p><button className="menu-buy" onClick={() => setConfiguring(item)}><ShoppingBag size={14}/> Customize & add</button></div></article>)}</div> : <div className="menu-empty"><strong>No dishes found</strong><span>Try another search or choose a different category.</span></div>}</div></section>
    <section id="story" className="section" style={{background:'var(--surface)'}}><div className="container story-grid"><div className="story-image"/><div className="story-copy"><span className="eyebrow">Our story</span><h2>From cheesy pizza<br/><em>to biryani flavour.</em></h2><p>We bring the comfort of a neighbourhood café to every order: generous portions, familiar favourites, and enough choice for the whole table. Pick your size, make it spicy, add a drink, and send it straight to the kitchen team.</p><div className="feature-list"><div className="feature"><div className="feature-mark"><Flame size={18}/></div><div><h4>Made to order</h4><p>Every pizza and platter is prepared fresh when your order arrives.</p></div></div><div className="feature"><div className="feature-mark"><Wheat size={18}/></div><div><h4>Something for everyone</h4><p>Cheesy pizzas, loaded burgers, biryani, curries and family deals.</p></div></div><div className="feature"><div className="feature-mark"><Clock3 size={18}/></div><div><h4>Easy WhatsApp ordering</h4><p>Build the basket, review your options, and send the details in one tap.</p></div></div></div></div></div></section>
    <section id="contact" className="section"><div className="container contact-panel"><div><span className="eyebrow">Find us</span><h2 className="section-title">Come say <em>hello.</em></h2><p className="muted" style={{maxWidth:420,lineHeight:1.8}}>Walk-ins welcome. For parties of 6 or more, we recommend reservations. Send us a note and we’ll help make the evening easy.</p><div className="contact-details"><div className="contact-item"><MapPin size={18}/><small>Visit us</small><strong>42 Elm Street<br/>Brooklyn, NY 11201</strong></div><div className="contact-item"><Phone size={18}/><small>Call us</small><strong>(718) 555-0142</strong></div><div className="contact-item"><Clock3 size={18}/><small>Hours</small><strong>Tue–Sun<br/>11:30am – 10pm</strong></div><div className="contact-item"><MessageCircle size={18}/><small>WhatsApp</small><strong>Orders answered fast</strong></div></div></div><div><span className="eyebrow">Plan something</span><h3 className="serif" style={{fontSize:30,margin:'16px 0 20px'}}>Let’s make it<br/><em style={{color:'var(--ember)',fontWeight:400}}>memorable.</em></h3><LeadForm/></div></div></section>
    <footer className="footer"><div className="container footer-inner"><div><div className="brand serif">Forno<span>&</span>Fiamma</div><div style={{marginTop:5}}>Big flavours, made for sharing</div></div><div className="footer-links"><a href="#menu">Menu</a><a href="#story">Story</a><a href="/admin/login">Admin</a></div><div>© {new Date().getFullYear()} Forno & Fiamma</div></div></footer>
    {configuring && <ProductConfigurator item={configuring} onClose={() => setConfiguring(null)} onAdd={addToCart}/>} {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onChange={setCart}/>} 
  </main>
}
