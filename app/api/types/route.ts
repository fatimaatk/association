import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const types = await prisma.typeFamille.findMany({
      where: { associationId: user.associationId },
      select: {
        id: true,
        nom: true,
      }
    });

    if (!types || types.length === 0) {
      return NextResponse.json({ error: "Aucun type de famille trouvé" }, { status: 404 });
    }

    return NextResponse.json(types);
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données" }, { status: 500 });
  }
}
