import { getMenu } from '@/lib/core'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return <HomeClient menu={await getMenu()} />
}
