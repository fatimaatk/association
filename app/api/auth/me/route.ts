import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function GET(req: NextRequest) {
  const token = cookies().get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ utilisateur: payload }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Token invalide' }, { status: 401 })
  }
}
