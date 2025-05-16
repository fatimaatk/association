import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

interface JwtPayload {
  id: string;
  email: string;
  prenom: string;
  associationId: string;
  association: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return NextResponse.json({ utilisateur: payload }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error, message: 'Token invalide' }, { status: 401 })
  }
}
