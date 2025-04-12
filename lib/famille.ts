import { IFamille, TypePaiement, StatutPaiement, convertToEnum } from "@/models/interfaceFamilles";
import { prisma } from "./prisma";

export async function getFamilles() {
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
      ...famille,
      cotisation: famille.cotisation ? {
        ...famille.cotisation,
        facture: famille.cotisation.facture ? {
          ...famille.cotisation.facture,
          typePaiement: convertToEnum<TypePaiement>(famille.cotisation.facture.typePaiement),
          statutPaiement: convertToEnum<StatutPaiement>(famille.cotisation.facture.statutPaiement),
        } : null,
      } : null,
    })) as IFamille[];
  } catch (error) {
    console.error("Erreur lors du fetch de la famille :", error);
    return null;
  }
}


export async function getFamilleById(id: string): Promise<IFamille | null> {
  if (!id) return null;

  try {
    const famille = await prisma.famille.findUnique({
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
      ...famille,
      cotisation: famille.cotisation ? {
        ...famille.cotisation,
        facture: famille.cotisation.facture ? {
          ...famille.cotisation.facture,
          typePaiement: famille.cotisation.facture.typePaiement as TypePaiement | null,
          statutPaiement: famille.cotisation.facture.statutPaiement as StatutPaiement | null,
        } : null,
      } : null,
    } as IFamille;
  } catch (error) {
    console.error("Erreur lors du fetch de la famille :", error);
    return null;
  }
}


export const getAdherentsByIds = async (ids: string[]) => {
  return prisma.famille.findMany({
    where: { id: { in: ids } },
    include: {
      chefFamille: true, cotisation: {
        include: {
          facture: true,
        }

      }
    } // ou selon ta structure
  });
};