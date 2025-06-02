import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function getUserFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return null
  }
} 