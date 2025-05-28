import { Prisma, PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { IMembres } from '@/models/interfaceFamilles';

const prisma = new PrismaClient();

const generateUniqueId = async (
  prismaClient: PrismaClient | Prisma.TransactionClient,
  baseId: string
): Promise<string> => {
  let uniqueId = baseId;
  let counter = 1;

  while (await prismaClient.membre.findUnique({ where: { id: uniqueId } })) {
    uniqueId = `${baseId}_${counter}`;
    counter++;
  }

  return uniqueId;
};

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  try {
    const {
      typeFamilleId,
      chefFamille,
      membres,
      adresse,
      adresseEmail,
      telephone,
      cotisation
    } = body;

    const chefId = `${chefFamille.nom}_${chefFamille.prenom}_${new Date(chefFamille.dateNaissance).getFullYear()}`.toLowerCase().replace(/\s+/g, '');

    const nouvelleFamille = await prisma.$transaction(async (tx) => {
      const chefDeFamille = await tx.membre.upsert({
        where: { id: chefId },
        update: {},
        create: {
          id: chefId,
          nom: chefFamille.nom,
          prenom: chefFamille.prenom,
          dateNaissance: chefFamille.dateNaissance,
          associationId: user.associationId,
        }
      });

      const famille = await tx.famille.create({
        data: {
          type: {
            connect: { id: typeFamilleId }
          },
          adresse,
          adresseEmail,
          telephone,
          chefFamille: {
            connect: { id: chefId }
          },
          membres: {
            create: await Promise.all(membres.map(async (membre: IMembres) => {
              const baseMembreId = `${membre.nom}_${membre.prenom}_${new Date(membre.dateNaissance).getFullYear()}`.toLowerCase().replace(/\s+/g, '');
              const membreId = await generateUniqueId(tx, baseMembreId);

              return {
                id: membreId,
                nom: membre.nom,
                prenom: membre.prenom,
                dateNaissance: membre.dateNaissance,
                associationId: user.associationId,
              };
            })),
          },
          ...(cotisation && {
            cotisation: {
              create: {
                montant: Number(cotisation.montant),
                associationId: user.associationId,
                ...(cotisation.facture && {
                  facture: {
                    create: {
                      typePaiement: cotisation.facture.typePaiement || null,
                      statutPaiement: cotisation.facture.statutPaiement || null,
                      datePaiement: cotisation.facture.datePaiement
                        ? new Date(cotisation.facture.datePaiement)
                        : null,
                      associationId: user.associationId,
                    },
                  },
                }),
              },
            },
          }),
          association: {
            connect: { id: user.associationId }
          },
        },
        include: {
          chefFamille: true,
          membres: true,
          cotisation: {
            include: { facture: true },
          },
        },
      });

      return { famille, chefDeFamille };
    });

    return NextResponse.json(nouvelleFamille, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la famille :", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({
          error: "Un membre avec cet identifiant existe déjà. Veuillez vérifier les informations."
        }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Une erreur est survenue lors de la création de la famille" }, { status: 500 });
  }
}
