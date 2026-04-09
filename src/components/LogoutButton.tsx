'use client'
import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const { logOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logOut()
    router.push('/admin/login')
  }

  return <button onClick={handleLogout}>Logout</button>
}
