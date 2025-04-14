import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import WrapperClient from './WrapperClient'

export default async function Wrapper({ children }: { children: React.ReactNode }) {
  const token = cookies().get('token')?.value
  if (!token) redirect('/login')

  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET || 'supersecret')
    return <WrapperClient utilisateur={userPayload}>{children}</WrapperClient>
  } catch (err) {
    console.error('❌ Token invalide ou expiré', err)
    redirect('/login')
  }
}