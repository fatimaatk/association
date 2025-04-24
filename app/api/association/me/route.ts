import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { associationId: string };

    const association = await prisma.association.findUnique({
      where: { id: decoded.associationId },
      select: {
        id: true,
        nom: true,
        adresse: true,
        siret: true,
        email: true,
        telephone: true,
        type: true,
      },
    });

    if (!association) {
      return NextResponse.json({ message: 'Association introuvable' }, { status: 404 });
    }

    return NextResponse.json(association, { status: 200 });
  } catch (error) {
    console.error('Erreur /api/association/me :', error);
    return NextResponse.json({ message: 'Token invalide ou erreur serveur' }, { status: 401 });
  }
}


export async function PUT(req: NextRequest) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { associationId: string };
    const body = await req.json();

    const updated = await prisma.association.update({
      where: { id: payload.associationId },
      data: {
        nom: body.nom,
        adresse: body.adresse,
        siret: body.siret,
        email: body.email,
        telephone: body.telephone,
        type: body.type,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[ASSOCIATION_UPDATE]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
