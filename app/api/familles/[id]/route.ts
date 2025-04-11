import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IMembres } from "@/models/interfaceFamilles";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return new Response("Missing ID", { status: 400 });
    const famille = await prisma.famille.findUnique({
      where: { id: id },
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
            prenom: true,
            dateNaissance: true,
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

    if (!famille) {
      return NextResponse.json({ error: "Famille non trouvée" }, { status: 404 })
    }

    // On envoie les valeurs d'énumération directement sans conversion
    return NextResponse.json(famille)
  } catch (error) {
    console.error('Erreur lors de la récupération de la famille :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données", }, { status: 500 })
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const famille = await prisma.famille.findUnique({
      where: { id },
      include: {
        chefFamille: true,
        membres: true,
        cotisation: {
          include: { facture: true },
        },
      },
    });

    if (!famille) {
      return NextResponse.json({ error: "Famille non trouvée" }, { status: 404 });
    }

    // 🔥 1. Supprimer les membres (sauf chef)
    await prisma.membre.deleteMany({
      where: {
        familleId: id,
        NOT: { id: famille.chefFamille.id },
      },
    });

    // 🔥 2. Supprimer la facture s’il y en a
    if (famille.cotisation?.facture) {
      await prisma.facture.delete({
        where: { cotisationId: famille.cotisation.id },
      });
    }

    // 🔥 3. Supprimer la cotisation
    if (famille.cotisation) {
      await prisma.cotisation.delete({
        where: { id: famille.cotisation.id },
      });
    }

    // 🔥 4. Supprimer la famille
    await prisma.famille.delete({
      where: { id },
    });

    // 🔥 5. Supprimer le chef de famille maintenant qu’il n’est plus référencé
    await prisma.membre.delete({
      where: { id: famille.chefFamille.id },
    });

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

  // Conversion des valeurs en énumérations
  const statutPaiementValue = body.cotisation?.facture?.statutPaiement;
  const typePaiementValue = body.cotisation?.facture?.typePaiement
    ;

  try {
    // Vérifiez si la famille existe déjà
    const existingFamille = await prisma.famille.findUnique({
      where: { id: body.id }
    });

    if (!existingFamille) {
      return NextResponse.json({
        error: "Famille non trouvée"
      }, { status: 404 });
    }

    // Mise à jour de la famille si elle existe
    const updatedFamille = await prisma.famille.update({
      where: { id: body.id },
      data: {
        typeFamilleId: body.typeFamilleId,
        adresse: body.adresse,
        adresseEmail: body.adresseEmail,
        telephone: body.telephone,
        chefFamilleId: body.chefFamille.id,
        membres: {
          update: body.membres.map((membre: IMembres) => ({
            where: { id: membre.id },
            data: {
              nom: membre.nom,
              prenom: membre.prenom,
              dateNaissance: membre.dateNaissance,
            }
          }))
        },
        cotisation: body.cotisation ? {
          upsert: {
            create: {
              montant: parseFloat(body.cotisation.montant),
              facture: {
                create: {
                  typePaiement: typePaiementValue,
                  statutPaiement: statutPaiementValue,
                  datePaiement: body.cotisation.facture?.datePaiement,
                }
              }
            },
            update: {
              montant: parseFloat(body.cotisation.montant),
              facture: {
                upsert: {
                  create: {
                    typePaiement: typePaiementValue,
                    statutPaiement: statutPaiementValue,
                    datePaiement: body.cotisation.facture?.datePaiement,
                  },
                  update: {
                    datePaiement: body.cotisation.facture?.datePaiement,
                    typePaiement: typePaiementValue,
                    statutPaiement: statutPaiementValue
                  }
                }
              }
            }
          }
        } : undefined
      },
      include: {
        type: true,
        chefFamille: true,
        membres: true,
        cotisation: {
          include: {
            facture: true
          }
        }
      }
    });

    return NextResponse.json(updatedFamille, { status: 200 });
  } catch (error) {
    console.error('Famille update error:', error);
    return NextResponse.json({
      error: "Erreur lors de la mise à jour de la famille"
    }, { status: 500 });
  }
}
