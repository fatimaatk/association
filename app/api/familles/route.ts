import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const familles = await prisma.famille.findMany({
      where: { associationId: user.associationId },
      include: {
        type: {
          select: { id: true, nom: true },
        },
        chefFamille: {
          select: { id: true, nom: true, prenom: true },
        },
        membres: {
          select: { id: true, nom: true, prenom: true },
        },
        cotisation: {
          select: {
            id: true,
            montant: true,
            facture: {
              select: {
                id: true,
                statutPaiement: true,
                typePaiement: true,
                datePaiement: true,
              },
            },
          },
        },
      },
    });

    if (!familles || familles.length === 0) {
      return NextResponse.json({ error: "Aucune famille trouvée" }, { status: 404 });
    }

    return NextResponse.json(familles);
  } catch (error) {
    console.error('Erreur lors dans la récupération de la famille :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données" }, { status: 500 });
  }
}
