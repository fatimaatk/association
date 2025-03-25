
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    const familles = await prisma.famille.findMany({
      include: {
        type: {
          select: {
            id: true,
            nom: true,
          }
        },
        chefFamille: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          }
        },
        membres: {
          select: {
            id: true,
            nom: true,
            prenom: true
          }
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
              }
            }
          }
        }
      }
    });

    if (!familles) {
      return NextResponse.json({ error: "Familles non trouvée" }, { status: 404 })
    }

    return NextResponse.json(familles)
  } catch (error) {
    console.error('Erreur lors dans la récupération de la famille :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données", }, { status: 500 })
  }
}


