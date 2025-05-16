import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { IMembres } from '@/models/interfaceFamilles';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    if (!id) return new Response("Missing ID", { status: 400 });

    const famille = await prisma.famille.findFirst({
      where: {
        id,
        associationId: user.associationId,
      },
      include: {
        type: { select: { id: true, nom: true } },
        chefFamille: { select: { id: true, nom: true, prenom: true } },
        membres: { select: { id: true, nom: true, prenom: true, dateNaissance: true } },
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

    if (!famille) {
      return NextResponse.json({ error: "Famille non trouvée" }, { status: 404 });
    }

    return NextResponse.json(famille);
  } catch (error) {
    console.error('Erreur lors de la récupération de la famille :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const famille = await prisma.famille.findFirst({
      where: {
        id,
        associationId: user.associationId,
      },
      include: {
        chefFamille: true,
        membres: true,
        cotisation: { include: { facture: true } },
      },
    });

    if (!famille) {
      return NextResponse.json({ error: "Famille non trouvée" }, { status: 404 });
    }

    await prisma.membre.deleteMany({
      where: {
        familleId: id,
        NOT: { id: famille.chefFamille.id },
      },
    });

    if (famille.cotisation?.facture) {
      await prisma.facture.delete({ where: { cotisationId: famille.cotisation.id } });
    }

    if (famille.cotisation) {
      await prisma.cotisation.delete({ where: { id: famille.cotisation.id } });
    }

    await prisma.famille.delete({ where: { id } });
    await prisma.membre.delete({ where: { id: famille.chefFamille.id } });

    return NextResponse.json({
      message: `La famille de ${famille.chefFamille.nom} ${famille.chefFamille.prenom} a bien été supprimée.`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const statutPaiementValue = body.cotisation?.facture?.statutPaiement;
  const typePaiementValue = body.cotisation?.facture?.typePaiement;

  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const cleanDate = (d: string | undefined) => {
    const date = new Date(d || '');
    return date.getFullYear() > 1971 ? date : null;
  };

  try {
    const existingFamille = await prisma.famille.findFirst({
      where: {
        id: body.id,
        associationId: user.associationId,
      },
    });

    if (!existingFamille) {
      return NextResponse.json({ error: "Famille non trouvée" }, { status: 404 });
    }

    const updatedFamille = await prisma.famille.update({
      where: { id: body.id },
      data: {
        type: {
          connect: { id: body.typeFamilleId },
        },
        adresse: body.adresse,
        adresseEmail: body.adresseEmail,
        telephone: body.telephone,
        chefFamille: {
          connect: { id: body.chefFamille.id },
        },
        association: {
          connect: { id: user.associationId },
        },
        membres: {
          update: body.membres
            .filter((m: IMembres) => m.id)
            .map((m: IMembres) => ({
              where: { id: m.id },
              data: {
                nom: m.nom,
                prenom: m.prenom,
                dateNaissance: m.dateNaissance,
              },
            })),
          create: body.membres
            .filter((m: IMembres) => !m.id)
            .map((m: IMembres) => ({
              nom: m.nom,
              prenom: m.prenom,
              dateNaissance: m.dateNaissance,
              associationId: user.associationId,
            })),
        },
        cotisation: body.cotisation
          ? {
            upsert: {
              create: {
                montant: parseFloat(body.cotisation.montant),
                associationId: user.associationId,
                facture: {
                  create: {
                    typePaiement: typePaiementValue,
                    statutPaiement: statutPaiementValue,
                    datePaiement: cleanDate(body.cotisation.facture?.datePaiement),
                    associationId: user.associationId,
                  },
                },
              },
              update: {
                montant: parseFloat(body.cotisation.montant),
                facture: {
                  upsert: {
                    create: {
                      typePaiement: typePaiementValue,
                      statutPaiement: statutPaiementValue,
                      datePaiement: cleanDate(body.cotisation.facture?.datePaiement),
                      associationId: user.associationId,
                    },
                    update: {
                      datePaiement: cleanDate(body.cotisation.facture?.datePaiement),
                      typePaiement: typePaiementValue,
                      statutPaiement: statutPaiementValue,
                    },
                  },
                },
              },
            },
          }
          : undefined,
      },
      include: {
        type: true,
        chefFamille: true,
        membres: true,
        cotisation: { include: { facture: true } },
      },
    });

    return NextResponse.json(updatedFamille, { status: 200 });
  } catch (error) {
    console.error('Famille update error:', error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la famille" }, { status: 500 });
  }
}
