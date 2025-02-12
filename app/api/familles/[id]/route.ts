
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return;
    const famille = await prisma.famille.findUnique({
      where: { id: params.id },
      include: {
        type: {
          select: {
            id: true,
            nom: true,
          }
        },
        representant: {
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

    return NextResponse.json(famille)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors du chargement des données", }, { status: 500 })
  }
}


export async function DELETE(req: Request) {
  const body = await req.json();
  try {
    // Vérifiez si la famille existe déjà
    const existingFamille = await prisma.famille.findUnique({
      where: { id: body.id },
      include: {
        representant: {
          select: {
            nom: true,
            prenom: true
          }
        }

      }
    });

    if (!existingFamille) {
      return NextResponse.json({
        error: "Famille non trouvée"
      }, { status: 404 });
    }

    // Mise à jour de la famille si elle existe
    const deletedFamille = await prisma.famille.delete({
      where: { id: body.id },
    });

    return NextResponse.json(`La famille de ${existingFamille.representant.nom} ${existingFamille.representant.prenom} a bien été supprimée.`, { status: 200 });
  } catch (error) {
    console.error('Famille update error:', error);
    return NextResponse.json({
      error: "Erreur lors de la mise à jour de la famille"
    }, { status: 500 });
  }
}



export async function PUT(req: Request) {
  const body = await req.json();
  const statutPaiementValue = body.cotisation.facture?.statutPaiement ?? "non payé";
  const typePaiementValue = body.cotisation.facture?.typePaiement ?? null;

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
        representantId: body.representant.id,
        membres: {
          update: body.membres.map((membre: any) => ({
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
        representant: true,
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
