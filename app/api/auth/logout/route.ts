// app/api/auth/logout/route.ts
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()

  cookieStore.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Expiration immédiate
  })

  return new Response(null, { status: 200 })
}
