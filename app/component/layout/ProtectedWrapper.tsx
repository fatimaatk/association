//C'est lui qui protège les pages privées

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import WrapperClient from './AppLayout'
import { TUser } from '@/context/UserContext'

export default async function ProtectedWrapper({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/')
  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as TUser

    return <WrapperClient utilisateur={userPayload}>{children}</WrapperClient>
  } catch (err) {
    console.error('❌ Token invalide ou expiré', err)
    redirect('/')
  }
}