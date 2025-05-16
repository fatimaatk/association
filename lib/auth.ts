import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function getUserFromRequest(req: Request): Promise<JwtPayload | null> {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')))

  const token = cookies.token
  if (!token) return null

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    return payload
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return null
  }
}

// Pour les pages (App Router)
export async function getUserFromCookies(): Promise<JwtPayload | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    return payload;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return null;
  }
}