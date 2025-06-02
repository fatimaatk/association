import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

// Fonction pour les composants serveur
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

// Fonction pour les composants client
export function getUserFromClientCookies(): JwtPayload | null {
  if (typeof window === 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return null;
  }
}