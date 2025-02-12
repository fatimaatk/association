import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req, res) {
  const body = await req.json();
  console.log(body.type)
  try {
    const {
      type,
      typeFamilleId,
      representant,
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
          create: membres.map(membre => ({
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: new Date(membre.dateNaissance),
          })),
        },
        // La première entrée est le représentant, on crée la relation
        representant: {
          create: {
            nom: representant.nom,
            prenom: representant.prenom,
            dateNaissance: new Date(representant.dateNaissance),
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
                    typePaiement: cotisation.facture.typePaiement,
                    statutPaiement: cotisation.facture.statutPaiement,
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
        representant: true,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}