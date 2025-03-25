import { IFamille } from "@/models/interfaceFamilles";
import { prisma } from "./prisma";

export async function getFamilles() {
  try {
    const familles: IFamille[] = await prisma.famille.findMany({
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
            dateNaissance: true,
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

    if (!familles) return null;

    return familles.map((famille) => ({
      id: famille.id,
      typeFamilleId: famille.typeFamilleId,
      type: {
        id: famille.type.id,
        nom: famille.type.nom,
      },
      chefFamille: {
        id: famille.chefFamille.id,
        nom: famille.chefFamille.nom,
        prenom: famille.chefFamille.prenom,
        dateNaissance: famille.chefFamille.dateNaissance,
      },
      membres: famille.membres.map((membre) => ({
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        dateNaissance: membre.dateNaissance,
      })),
      cotisation: famille.cotisation ? {
        id: famille.cotisation.id,
        montant: famille.cotisation.montant,
        facture: famille.cotisation.facture ? {
          id: famille.cotisation.facture.id,
          statutPaiement: famille.cotisation.facture.statutPaiement ?? undefined,
          typePaiement: famille.cotisation.facture.typePaiement ?? undefined,
          datePaiement: famille.cotisation.facture.datePaiement ?? undefined,
        } : null,
      } : null,
      adresse: famille.adresse,
      adresseEmail: famille.adresseEmail,
      telephone: famille.telephone,
    }));
  } catch (error) {
    console.error("Erreur lors du fetch de la famille :", error);
    return null;
  }
}


export async function getFamilleById(id: string): Promise<IFamille | null> {
  if (!id) return null;

  try {
    const famille: IFamille | null = await prisma.famille.findUnique({
      where: { id },
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
            dateNaissance: true,
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

    if (!famille) return null;

    return {
      id: famille.id,
      typeFamilleId: famille.typeFamilleId,
      type: {
        id: famille.type.id,
        nom: famille.type.nom,
      },
      chefFamille: {
        id: famille.chefFamille.id,
        nom: famille.chefFamille.nom,
        prenom: famille.chefFamille.prenom,
        dateNaissance: famille.chefFamille.dateNaissance,
      },
      membres: famille.membres.map((membre) => ({
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        dateNaissance: membre.dateNaissance,
      })),
      cotisation: famille.cotisation ? {
        id: famille.cotisation.id,
        montant: famille.cotisation.montant,
        facture: famille.cotisation.facture ? {
          id: famille.cotisation.facture.id,
          statutPaiement: famille.cotisation.facture.statutPaiement ?? undefined,
          typePaiement: famille.cotisation.facture.typePaiement ?? undefined,
          datePaiement: famille.cotisation.facture.datePaiement ?? undefined,
        } : null,
      } : null,
      adresse: famille.adresse,
      adresseEmail: famille.adresseEmail,
      telephone: famille.telephone,
    };
  } catch (error) {
    console.error("Erreur lors du fetch de la famille :", error);
    return null;
  }
}
