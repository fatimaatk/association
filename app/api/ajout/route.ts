import { IMembres } from '@/models/interfaceFamilles';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const {
      typeFamilleId,
      chefFamille,
      membres,
      adresse,
      adresseEmail,
      cotisation
    } = body;

    // Créer la famille et tous les membres (y compris le représentant) en une seule transaction
    const nouvelleFamille = await prisma.famille.create({
      data: {
        type: {
          connect: {
            id: typeFamilleId
          }
        },
        //typeFamilleId: typeFamilleId,
        adresse,
        adresseEmail,
        // Créer tous les membres, y compris le représentant
        membres: {
          create: membres.map((membre: IMembres) => ({
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: new Date(membre.dateNaissance),
          })),
        },
        // La première entrée est le représentant, on crée la relation
        chefFamille: {
          create: {
            nom: chefFamille.nom,
            prenom: chefFamille.prenom,
            dateNaissance: new Date(chefFamille.dateNaissance),
          }
        },
        // Créer la cotisation et la facture si présentes
        ...(cotisation && {
          cotisation: {
            create: {
              montant: Number(cotisation.montant),
              ...(cotisation.facture && {
                facture: {
                  create: {
                    typePaiement: cotisation.facture.typePaiement || null,
                    statutPaiement: cotisation.facture.statutPaiement || null,
                    datePaiement: cotisation.facture.datePaiement
                      ? new Date(cotisation.facture.datePaiement)
                      : null,
                  },
                },
              }),
            },
          },
        }),
      },
      include: {
        chefFamille: true,
        membres: true,
        cotisation: {
          include: {
            facture: true,
          },
        },
      },
    });

    return NextResponse.json(nouvelleFamille, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la famille :', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}