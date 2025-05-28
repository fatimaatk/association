import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const where: Prisma.MembreWhereInput = {
    associationId: user.associationId,
    ...(year && { annee: parseInt(year) }),
    ...(status && status !== 'TOUS' && { statut: status as 'ACTIF' | 'INACTIF' | 'ARCHIVE' }),
    ...(search && {
      OR: [
        { nom: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { prenom: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
      ]
    })
  };

  const membres = await prisma.membre.findMany({
    where,
    include: {
      famille: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return NextResponse.json(membres);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const data = await req.json();
  const { nom, prenom, dateNaissance, familleId, statut = 'ACTIF' } = data;

  const membre = await prisma.membre.create({
    data: {
      nom,
      prenom,
      dateNaissance: new Date(dateNaissance),
      dateEntree: new Date(),
      statut: statut as 'ACTIF' | 'INACTIF' | 'ARCHIVE',
      annee: new Date().getFullYear(),
      associationId: user.associationId,
      familleId
    }
  });

  return NextResponse.json(membre);
}

export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const data = await req.json();
  const { id, statut, dateSortie } = data;

  const membre = await prisma.membre.update({
    where: { id },
    data: {
      statut: statut as 'ACTIF' | 'INACTIF' | 'ARCHIVE',
      dateSortie: dateSortie ? new Date(dateSortie) : null
    }
  });

  return NextResponse.json(membre);
}
