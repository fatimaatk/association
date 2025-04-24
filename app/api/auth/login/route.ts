import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, motDePasse } = body

  if (!email || !motDePasse) {
    return NextResponse.json({ message: 'Email et mot de passe requis' }, { status: 400 })
  }

  try {
    const compte = await prisma.compte.findUnique({
      where: { email },
      include: { association: true }
    })

    const passwordOk = compte && await bcrypt.compare(motDePasse, compte.motDePasse)
    if (!compte || !passwordOk) {
      return NextResponse.json({ message: 'Identifiants invalides' }, { status: 401 })
    }

    const token = jwt.sign(
      {
        id: compte.id,
        email: compte.email,
        prenom: compte.prenom,
        association: compte.association.nom,
        associationId: compte.associationId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // ✅ Utilisation asynchrone des cookies()
    const cookieStore = await cookies(); // ✅
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return NextResponse.json({
      message: 'Connexion réussie',
      utilisateur: {
        nom: compte.nom,
        prenom: compte.prenom,
        email: compte.email,
        association: compte.association.nom
      }
    })
  } catch (err) {
    console.error('[LOGIN_ERROR]', err)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
