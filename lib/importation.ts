import { IFamilleImport, IMembreImport } from "@/models/interfaceFamilles";
import { PrismaClient, StatutPaiement, TypePaiement, StatutMembre } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

function generateCustomId(nom: string, prenom: string, dateNaissance: Date): string {
  return `${nom}_${prenom}_${dateNaissance}`.toLowerCase().replace(/\s+/g, '');
}

export function getTypePaiement(value: string | null | undefined): TypePaiement | null {
  if (!value) return null;
  const upper = value.toUpperCase();
  return Object.values(TypePaiement).includes(upper as TypePaiement)
    ? upper as TypePaiement
    : null;
}

export function getStatutPaiement(value: string | null | undefined): StatutPaiement | null {
  if (!value) return null;
  const upper = value.toUpperCase();
  return Object.values(StatutPaiement).includes(upper as StatutPaiement)
    ? upper as StatutPaiement
    : null;
}

export function getStatutMembre(value: string | null | undefined): StatutMembre {
  if (!value) return StatutMembre.ACTIF;
  const upper = value.toUpperCase();
  return Object.values(StatutMembre).includes(upper as StatutMembre)
    ? upper as StatutMembre
    : StatutMembre.ACTIF;
}

function convertirDateExcel(dateExcel: unknown): string {
  if (dateExcel instanceof Date) {
    return dateExcel.toISOString();
  }

  // Si c'est un nombre Excel (genre 25121)
  if (typeof dateExcel === 'number') {
    const date = XLSX.SSF.parse_date_code(dateExcel);
    if (date) {
      const jsDate = new Date(date.y, date.m - 1, date.d);
      return jsDate.toISOString();
    }
  }

  // Si c'est une chaîne au format YYYY-MM-DD
  if (typeof dateExcel === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateExcel)) {
    const date = new Date(dateExcel);
    return date.toISOString();
  }

  throw new Error(`Date invalide : ${dateExcel}`);
}

export async function importExcel(fileBuffer: Buffer, associationId: string) {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const famillesSheet = workbook.Sheets["Familles"];
    const membresSheet = workbook.Sheets["Membres"];

    if (!famillesSheet || !membresSheet) {
      throw new Error("Les onglets 'Familles' et 'Membres' sont requis.");
    }

    const famillesData: IFamilleImport[] = XLSX.utils.sheet_to_json(famillesSheet);
    const membresData: IMembreImport[] = XLSX.utils.sheet_to_json(membresSheet);

    const famillesMap = new Map();

    for (const famille of famillesData) {
      try {
        const familleId = generateCustomId(
          famille.chefFamille_nom,
          famille.chefFamille_prenom,
          famille.chefFamille_dateNaissance
        );

        const chefFamille = await prisma.membre.upsert({
          where: { id: familleId },
          update: {
            nom: famille.chefFamille_nom,
            prenom: famille.chefFamille_prenom,
            dateNaissance: convertirDateExcel(famille.chefFamille_dateNaissance),
            dateEntree: famille.dateEntree ? new Date(famille.dateEntree) : new Date(),
            dateSortie: famille.dateSortie ? new Date(famille.dateSortie) : null,
            statut: getStatutMembre(famille.statut),
            associationId
          },
          create: {
            id: familleId,
            nom: famille.chefFamille_nom,
            prenom: famille.chefFamille_prenom,
            dateNaissance: convertirDateExcel(famille.chefFamille_dateNaissance),
            dateEntree: famille.dateEntree ? new Date(famille.dateEntree) : new Date(),
            dateSortie: famille.dateSortie ? new Date(famille.dateSortie) : null,
            statut: getStatutMembre(famille.statut),
            associationId
          }
        });

        let typeFamille = await prisma.typeFamille.findFirst({
          where: {
            nom: famille.typeFamille_nom,
            associationId
          }
        });

        if (!typeFamille) {
          typeFamille = await prisma.typeFamille.create({
            data: {
              id: famille.typeFamille_nom.toLowerCase().replace(/\s+/g, ''),
              nom: famille.typeFamille_nom,
              associationId
            }
          });
        }

        await prisma.famille.upsert({
          where: { id: familleId },
          update: {
            typeFamilleId: typeFamille.id,
            chefFamilleId: chefFamille.id,
            adresse: famille.adresse || "",
            adresseEmail: famille.adresseEmail || "",
            telephone: famille.telephone || "",
            associationId
          },
          create: {
            id: familleId,
            typeFamilleId: typeFamille.id,
            chefFamilleId: chefFamille.id,
            adresse: famille.adresse || "",
            adresseEmail: famille.adresseEmail || "",
            telephone: famille.telephone || "",
            associationId,
            cotisation: {
              create: {
                montant: parseFloat((famille.montant_cotisation ?? 0).toString()) || 0,
                associationId,
                facture: {
                  create: {
                    typePaiement: getTypePaiement(famille.typePaiement),
                    statutPaiement: getStatutPaiement(famille.statutPaiement),
                    datePaiement: famille.datePaiement ? new Date(famille.datePaiement) : null,
                    associationId
                  }
                }
              }
            }
          }
        });

        await prisma.membre.update({
          where: { id: familleId },
          data: { familleId }
        });

        famillesMap.set(
          famille.chefFamille_nom + '_' + famille.chefFamille_prenom + '_' + famille.chefFamille_dateNaissance,
          familleId
        );
        console.log(`✅ Famille traitée : ${famille.chefFamille_nom} ${famille.chefFamille_prenom}`);
      } catch (error) {
        console.error(`❌ Erreur traitement famille ${famille.chefFamille_nom}:`, error);
        throw new Error(`❌ Erreur traitement famille ${famille.chefFamille_nom} : ${error}`);
      }
    }

    for (const membre of membresData) {
      try {
        const familleId = famillesMap.get(
          membre.familleChefNom + '_' + membre.familleChefPrenom + '_' + membre.dateNaissance
        );

        if (!familleId) {
          console.warn(`⚠️ Famille non trouvée pour le membre ${membre.nom} ${membre.prenom}`);
          continue;
        }

        const membreId = generateCustomId(membre.nom, membre.prenom, membre.dateNaissance);

        if (membreId === familleId) {
          console.log(`ℹ️ ${membre.nom} ${membre.prenom} est déjà enregistré comme chef de famille, ignoré`);
          continue;
        }

        await prisma.membre.upsert({
          where: { id: membreId },
          update: {
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: convertirDateExcel(membre.dateNaissance),
            dateEntree: membre.dateEntree ? new Date(membre.dateEntree) : new Date(),
            dateSortie: membre.dateSortie ? new Date(membre.dateSortie) : null,
            statut: getStatutMembre(membre.statut),
            familleId,
            associationId
          },
          create: {
            id: membreId,
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: convertirDateExcel(membre.dateNaissance),
            dateEntree: membre.dateEntree ? new Date(membre.dateEntree) : new Date(),
            dateSortie: membre.dateSortie ? new Date(membre.dateSortie) : null,
            statut: getStatutMembre(membre.statut),
            familleId,
            associationId
          }
        });

        console.log(`✅ Membre traité : ${membre.nom} ${membre.prenom}`);
      } catch (error) {
        console.error(`❌ Erreur traitement membre ${membre.nom}:`, error);
      }
    }

    return {
      success: true,
      message: `Importation terminée avec succès : ${famillesData.length} familles et ${membresData.length} membres importés`
    };
  } catch (error) {
    console.error("❌ Erreur globale:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
