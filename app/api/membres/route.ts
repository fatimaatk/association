import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const membres = await prisma.membre.findMany({
      where: { associationId: user.associationId },
    });

    if (!membres || membres.length === 0) {
      return NextResponse.json({ error: "Aucun membre trouvé" }, { status: 404 });
    }

    return NextResponse.json(membres);
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
