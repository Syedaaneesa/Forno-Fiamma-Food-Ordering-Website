import { PrismaClient } from '@prisma/client'
import { seedMenu } from '../lib/core'

const prisma = new PrismaClient()

async function main() {
  for (const item of seedMenu) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: { name: item.name, description: item.description, price: item.price, image: item.image, tag: item.tag, category: item.category, sizes: item.sizes, variants: item.variants, addons: item.addons, featured: Boolean(item.featured), isDeal: Boolean(item.isDeal), active: item.active },
      create: { id: item.id, slug: item.slug, name: item.name, description: item.description, price: item.price, image: item.image, tag: item.tag, category: item.category, sizes: item.sizes, variants: item.variants, addons: item.addons, featured: Boolean(item.featured), isDeal: Boolean(item.isDeal), active: item.active },
    })
  }
}

main().finally(() => prisma.$disconnect())
