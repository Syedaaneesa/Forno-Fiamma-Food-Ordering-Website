import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSessionToken } from '@/lib/core'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = await readSessionToken(cookieStore.get('forno_session')?.value)
  if (!session) redirect('/admin/login')
  return <AdminDashboard session={session}/>
}
