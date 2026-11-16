import { PrismaClient } from '@prisma/client'
import { SignJWT, jwtVerify } from 'jose'
import { z } from 'zod'

export type MenuOption = { id: string; label: string; price: number }
export type MenuAddon = MenuOption & { category: string }
export type MenuItem = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  image: string
  tag: string
  category: string
  active: boolean
  featured?: boolean
  isDeal?: boolean
  sizes?: MenuOption[]
  variants?: MenuOption[]
  addons?: MenuOption[]
}

const pizzaSizes = (small: number, medium: number, large: number): MenuOption[] => [
  { id: 'small', label: 'Small', price: small }, { id: 'medium', label: 'Medium', price: medium }, { id: 'large', label: 'Large', price: large },
]
const addon = (id: string, label: string, price: number): MenuOption => ({ id, label, price })

export const addonMenu: MenuAddon[] = [
  { ...addon('coke', 'Coke can', 80), category: 'Drinks' },
  { ...addon('pepsi', 'Pepsi can', 80), category: 'Drinks' },
  { ...addon('fries', 'French fries', 180), category: 'Sides' },
  { ...addon('loaded-fries', 'BBQ loaded fries', 300), category: 'Sides' },
  { ...addon('chutney', 'Mint chutney', 40), category: 'Sauces' },
  { ...addon('garlic-dip', 'Garlic dip', 60), category: 'Sauces' },
]

const pizza = (id: string, name: string, description: string, price: number, image: string, tag: string, sizes = pizzaSizes(price, price + 300, price + 650), extra: Partial<MenuItem> = {}): MenuItem => ({ id, slug: id, name, description, price, image, tag, category: 'Pizza', active: true, sizes, addons: addonMenu.filter((item) => ['coke', 'pepsi', 'chutney', 'garlic-dip'].includes(item.id)), ...extra })
const product = (id: string, name: string, description: string, price: number, image: string, category: string, tag = 'Popular', extra: Partial<MenuItem> = {}): MenuItem => ({ id, slug: id, name, description, price, image, tag, category, active: true, addons: addonMenu, ...extra })

export const seedMenu: MenuItem[] = [
  pizza('malai-boti', 'Malai Boti', 'Creamy chicken, roasted peppers, onion, mozzarella, coriander and a smoky tikka finish.', 650, '/images/margherita.png', 'Signature', undefined, { featured: true }),
  pizza('double-cheese-melt', 'Double Cheese Melt', 'House tomato sauce, double mozzarella, cheddar melt and oregano.', 650, '/images/quattro-formaggi.png', 'Cheesy'),
  pizza('tex-mex', 'Tex-Mex', 'Spiced chicken, jalapeño, olives, peppers, sweet corn and chipotle sauce.', 650, '/images/diavola.png', 'Zesty'),
  pizza('spicy-ranch', 'Spicy Ranch', 'Chicken, onion, jalapeño, ranch drizzle and a hot peri-peri finish.', 700, '/images/pepperoni.png', 'Spicy'),
  pizza('creamy-tikka', 'Creamy Tikka', 'Tikka chicken, creamy sauce, onion, green pepper and mozzarella.', 700, '/images/margherita.png', 'Creamy'),
  pizza('chicken-dynamite', 'Chicken Dynamite', 'Crunchy chicken, dynamite sauce, mozzarella and fresh herbs.', 750, '/images/diavola.png', 'Hot'),
  pizza('bbq-delight', 'BBQ Delight', 'BBQ chicken, smoked cheese, onion, peppers and house BBQ glaze.', 750, '/images/pepperoni.png', 'BBQ'),
  pizza('arabian-ranch', 'Arabian Ranch', 'Mild spiced chicken, ranch, olives, peppers and herbs.', 750, '/images/ortolana.png', 'House Pick'),
  pizza('bihari-kabab', 'Bihari Kabab', 'Bihari beef kabab, onion, green chilli, mozzarella and smoky sauce.', 800, '/images/prosciutto.png', 'Premium'),
  pizza('marinara-classic', 'Marinara Classic', 'San Marzano tomato, garlic, basil, oregano and extra virgin olive oil.', 550, '/images/margherita.png', 'Classic'),
  pizza('chicken-fajita', 'Chicken Fajita', 'Fajita chicken, onion, capsicum, jalapeño and Mexican herbs.', 700, '/images/diavola.png', 'Popular'),
  pizza('pepperoni-chicken', 'Pepperoni & Chicken', 'Cup-and-char pepperoni, chicken, mozzarella and house sauce.', 800, '/images/pepperoni.png', 'Loaded'),
  pizza('chicken-tikka', 'Chicken Tikka', 'Classic tikka chicken, onion, peppers and mozzarella.', 700, '/images/margherita.png', 'Classic'),
  pizza('euro-smoked', 'Euro Smoked', 'Smoked chicken, mushrooms, olives, mozzarella and garlic cream.', 800, '/images/quattro-formaggi.png', 'Smoked'),
  product('cowboy-burger', 'Cowboy Burger', 'Beef patty, cheddar, crispy onion, BBQ sauce and pickles.', 650, '/images/pepperoni.png', 'Burgers', 'Best Seller', { featured: true, variants: [addon('single', 'Single patty', 0), addon('double', 'Double patty', 180)] }),
  product('maxican-bbq', 'Mexican BBQ Burger', 'Beef patty, jalapeño, salsa, cheddar and smoky BBQ sauce.', 650, '/images/diavola.png', 'Burgers', 'Spicy'),
  product('crispy-chicken-sandwich', 'Chicken Crispy Sandwich', 'Crispy chicken fillet, lettuce, mayo, pickles and toasted bun.', 600, '/images/margherita.png', 'Burgers', 'Crispy'),
  product('chicken-cheese-grill', 'Chicken Cheese Grill', 'Grilled chicken, melted cheese, lettuce and house sauce.', 600, '/images/quattro-formaggi.png', 'Burgers', 'Grilled'),
  product('smokehouse', 'Smokehouse Burger', 'Smoked beef, cheddar, caramelized onion and pepper sauce.', 600, '/images/pepperoni.png', 'Burgers', 'Smoked'),
  product('zinger-cheese', 'Zinger Cheese Burger', 'Crunchy zinger, cheese slice, lettuce and spicy mayo.', 570, '/images/diavola.png', 'Burgers', 'Popular'),
  product('hot-wings', 'Hot Wings', 'Crispy wings tossed in your choice of hot or BBQ sauce.', 400, '/images/diavola.png', 'Snacks', 'Hot', { variants: [addon('six', '6 pieces', 0), addon('twelve', '12 pieces', 350)] }),
  product('french-fries', 'French Fries', 'Golden fries with seasoning and a side of house dip.', 200, '/images/ortolana.png', 'Snacks', 'Classic'),
  product('bbq-loaded-fries', 'BBQ Loaded Fries', 'Fries loaded with chicken, cheese, BBQ sauce and jalapeño.', 750, '/images/pepperoni.png', 'Snacks', 'Loaded'),
  product('family-bucket', 'Family Bucket', 'Crunchy broast chicken bucket for the table.', 2200, '/images/diavola.png', 'Crunch & Broast', 'Family Deal', { isDeal: true, variants: [addon('family', 'Family bucket', 0), addon('quarter', 'Quarter bucket', -1450)] }),
  product('full-broast', 'Full Broast', 'Crispy golden broast with fries, dip and fresh salad.', 1650, '/images/diavola.png', 'Crunch & Broast', 'Full'),
  product('broast-leg', 'Broast Leg Piece', 'Single crunchy broast leg with dip.', 400, '/images/diavola.png', 'Crunch & Broast', 'Quick Bite'),
  product('family-biryani', 'Family Pack Biryani', 'Fragrant chicken biryani with raita and salad.', 1750, '/images/interior.png', 'Biryani', 'Family Deal', { isDeal: true, variants: [addon('family', 'Family pack', 0), addon('quarter', 'Quarter pack', -1000)] }),
  product('chicken-biryani', 'Chicken Biryani', 'Aromatic basmati rice, chicken, herbs and traditional masala.', 450, '/images/interior.png', 'Biryani', 'Popular'),
  product('shami-kabab-biryani', 'Biryani Rice with Shami Kabab', 'Biryani rice served with a tender shami kabab.', 370, '/images/interior.png', 'Biryani', 'House Pick'),
  product('chicken-karahi', 'Chicken Karahi', 'Tomato, ginger, garlic, green chilli and wok-tossed chicken.', 850, '/images/margherita.png', 'Curries', 'House Special', { sizes: [{ id: 'half', label: 'Half', price: 450 }, { id: 'full', label: 'Full', price: 850 }] }),
  product('chicken-makhani', 'Chicken Makhani', 'Silky tomato butter curry with cream and warming spices.', 700, '/images/quattro-formaggi.png', 'Curries', 'Creamy', { sizes: [{ id: 'half', label: 'Half', price: 450 }, { id: 'full', label: 'Full', price: 700 }] }),
  product('daal', 'Shahi Daal', 'Slow-cooked lentils finished with butter, garlic and spices.', 250, '/images/ortolana.png', 'Curries', 'Comfort'),
  product('pizza-pasta-deal', 'Pizza & Pasta Deal', 'Medium pizza with creamy pasta and two drinks.', 1950, '/images/margherita.png', 'Value Meals', 'Best Value', { isDeal: true }),
  product('dual-zinger-deal', 'Dual Zinger Deal', 'Two zinger burgers, fries and two drinks.', 1300, '/images/pepperoni.png', 'Value Meals', 'Best Value', { isDeal: true }),
  product('medium-pizza-deal', 'Medium Pizza Deal', 'Medium pizza, fries, dip and two drinks.', 2250, '/images/margherita.png', 'Value Meals', 'Family Deal', { isDeal: true }),
  product('large-pizza-deal', 'Large Pizza Deal', 'Large pizza, loaded fries, four drinks and dips.', 3500, '/images/quattro-formaggi.png', 'Value Meals', 'Party Deal', { isDeal: true }),
  product('coke', 'Coke', 'Chilled can.', 80, '/images/hero.png', 'Extras', 'Drink'),
  product('pepsi', 'Pepsi', 'Chilled can.', 80, '/images/hero.png', 'Extras', 'Drink'),
  product('mint-chutney', 'Mint Chutney', 'Fresh mint and coriander chutney.', 40, '/images/ortolana.png', 'Extras', 'Sauce'),
]

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? (process.env.DATABASE_URL ? new PrismaClient() : null)
if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma

type FallbackState = { menu: MenuItem[]; admins: Array<{ id: string; name: string; email: string; passwordHash: string; role: string }>; orders: Array<Record<string, unknown>>; leads: Array<Record<string, unknown>>; footprint: Array<Record<string, unknown>> }
const globalForFallback = globalThis as unknown as { restaurantFallback?: FallbackState }
export const fallback = globalForFallback.restaurantFallback ?? { menu: seedMenu, admins: [], orders: [], leads: [], footprint: [] }
if (process.env.NODE_ENV !== 'production') globalForFallback.restaurantFallback = fallback

function parseOptions(value: unknown): MenuOption[] | undefined { return Array.isArray(value) ? value as MenuOption[] : undefined }
export async function getMenu(includeInactive = false): Promise<MenuItem[]> {
  if (prisma) {
    try {
      const rows = await prisma.menuItem.findMany({ where: includeInactive ? undefined : { active: true }, orderBy: { createdAt: 'asc' } })
      if (rows.length) return rows.map((row) => ({ id: row.id, slug: row.slug, name: row.name, description: row.description, price: row.price, image: row.image, tag: row.tag, category: row.category, active: row.active, featured: row.featured, isDeal: row.isDeal, sizes: parseOptions(row.sizes), variants: parseOptions(row.variants), addons: parseOptions(row.addons) }))
    } catch (error) { console.warn('Menu database unavailable; serving safe seed menu.', error) }
  }
  return includeInactive ? fallback.menu : fallback.menu.filter((item) => item.active)
}

export const orderSchema = z.object({ customerName: z.string().trim().min(2).max(80), phone: z.string().trim().min(7).max(30), notes: z.string().trim().max(500).optional().default(''), fulfillment: z.enum(['pickup', 'delivery']).default('pickup'), items: z.array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(20), size: z.string().max(40).optional(), variant: z.string().max(60).optional(), addons: z.array(z.string().max(60)).max(10).optional().default([]) })).min(1).max(30) })
export const leadSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(120), phone: z.string().trim().max(30).optional().default(''), message: z.string().trim().min(5).max(1000), source: z.string().trim().max(80).optional().default('website') })
export const footprintSchema = z.object({ event: z.enum(['page_view', 'menu_view', 'add_to_cart', 'cart_open', 'order_started', 'order_completed']), path: z.string().trim().max(500).default('/'), referrer: z.string().trim().max(500).optional().default(''), metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional().default({}) })

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'forno-fiamma-development-secret-change-me')
export type Session = { sub: string; email: string; name: string; role: 'SUPERADMIN'; exp: number }
export async function createSessionToken(input: Omit<Session, 'exp'>) { return new SignJWT(input).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret) }
export async function readSessionToken(token: string | undefined): Promise<Session | null> { if (!token) return null; try { const { payload } = await jwtVerify(token, secret); if (payload.role !== 'SUPERADMIN' || typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.name !== 'string') return null; return { sub: payload.sub, email: payload.email, name: payload.name, role: 'SUPERADMIN', exp: Number(payload.exp || 0) } } catch { return null } }
export function sessionCookieOptions() { const secure = process.env.SESSION_COOKIE_SECURE !== 'false'; return { httpOnly: true, secure, sameSite: secure ? ('none' as const) : ('lax' as const), path: '/', maxAge: 60 * 60 * 24 * 7 } }
export async function hashPassword(password: string) { const crypto = await import('node:crypto'); return new Promise<string>((resolve, reject) => crypto.scrypt(password, process.env.PASSWORD_SALT || 'forno-fiamma-salt', 64, (error, derived) => error ? reject(error) : resolve(derived.toString('hex')))) }
export async function verifyPassword(password: string, hash: string) { return (await hashPassword(password)) === hash }
export async function getSessionFromRequest(request: Request) { const cookie = request.headers.get('cookie') || ''; const token = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('forno_session='))?.split('=').slice(1).join('='); return readSessionToken(token) }
export async function requireSession(request: Request) { const session = await getSessionFromRequest(request); if (!session) throw new Error('UNAUTHORIZED'); return session }
export function jsonError(message: string, status = 400) { return Response.json({ error: message }, { status }) }
