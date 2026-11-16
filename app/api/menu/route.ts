import { getMenu } from '@/lib/core'

export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({ menu: await getMenu() })
}
