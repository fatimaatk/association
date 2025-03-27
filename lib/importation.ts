import { IFamilleImport, IMembreImport, StatutPaiement, TypePaiement, } from "@/models/interfaceFamilles";
import { PrismaClient } from "@prisma/client";
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

export async function importExcel(fileBuffer: Buffer) {
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

        // Création initiale du chef de famille sans référence à la famille
        const chefFamille = await prisma.membre.upsert({
          where: { id: familleId },
          update: {
            nom: famille.chefFamille_nom,
            prenom: famille.chefFamille_prenom,
            dateNaissance: famille.chefFamille_dateNaissance instanceof Date
              ? famille.chefFamille_dateNaissance.toISOString()
              : famille.chefFamille_dateNaissance
          },
          create: {
            id: familleId,
            nom: famille.chefFamille_nom,
            prenom: famille.chefFamille_prenom,
            dateNaissance: famille.chefFamille_dateNaissance instanceof Date
              ? famille.chefFamille_dateNaissance.toISOString()
              : famille.chefFamille_dateNaissance
            // La référence familleId sera ajoutée après la création de la famille
          }
        });

        const typeFamille = await prisma.typeFamille.upsert({
          where: { nom: famille.typeFamille_nom },
          update: {},
          create: {
            id: famille.typeFamille_nom.toLowerCase().replace(/\s+/g, ''),
            nom: famille.typeFamille_nom
          }
        });

        // Création de la famille
        await prisma.famille.upsert({
          where: { id: familleId },
          update: {
            typeFamilleId: typeFamille.id,
            chefFamilleId: chefFamille.id,
            adresse: famille.adresse || "",
            adresseEmail: famille.adresseEmail || "",
            telephone: famille.telephone || ""
          },
          create: {
            id: familleId,
            typeFamilleId: typeFamille.id,
            chefFamilleId: chefFamille.id,
            adresse: famille.adresse || "",
            adresseEmail: famille.adresseEmail || "",
            telephone: famille.telephone || "",
            cotisation: {
              create: {
                montant: parseFloat((famille.montant_cotisation ?? 0).toString()) || 0,
                facture: {
                  create: {
                    typePaiement: getTypePaiement(famille.typePaiement),
                    statutPaiement: getStatutPaiement(famille.statutPaiement),
                    datePaiement: famille.datePaiement ? new Date(famille.datePaiement) : null
                  }
                }
              }
            }
          }
        });

        // Mise à jour du chef de famille pour l'associer à sa propre famille
        await prisma.membre.update({
          where: { id: familleId },
          data: { familleId: familleId }
        });

        famillesMap.set(famille.chefFamille_nom + '_' + famille.chefFamille_prenom, familleId);
        console.log(`✅ Famille traitée : ${famille.chefFamille_nom} ${famille.chefFamille_prenom}`);
      } catch (error) {
        console.error(`❌ Erreur traitement famille ${famille.chefFamille_nom}:`, error);
      }
    }

    for (const membre of membresData) {
      try {
        const familleId = famillesMap.get(membre.familleChefNom + '_' + membre.familleChefPrenom);

        if (!familleId) {
          console.warn(`⚠️ Famille non trouvée pour le membre ${membre.nom} ${membre.prenom}`);
          continue;
        }

        const membreId = generateCustomId(membre.nom, membre.prenom, membre.dateNaissance);

        // Vérification si ce membre n'est pas déjà le chef de famille
        if (membreId === familleId) {
          console.log(`ℹ️ ${membre.nom} ${membre.prenom} est déjà enregistré comme chef de famille, ignoré`);
          continue;
        }

        await prisma.membre.upsert({
          where: { id: membreId },
          update: {
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: membre.dateNaissance instanceof Date
              ? membre.dateNaissance.toISOString()
              : membre.dateNaissance,
            familleId: familleId
          },
          create: {
            id: membreId,
            nom: membre.nom,
            prenom: membre.prenom,
            dateNaissance: membre.dateNaissance instanceof Date
              ? membre.dateNaissance.toISOString()
              : membre.dateNaissance,
            familleId: familleId
          }
        });

        console.log(`✅ Membre traité : ${membre.nom} ${membre.prenom}`);
      } catch (error) {
        console.error(`❌ Erreur traitement membre ${membre.nom}:`, error);
      }
    }

    return { success: true, message: `Importation terminée avec succès : ${famillesData.length} familles et ${membresData.length} membres importés` };
  } catch (error) {
    console.error("❌ Erreur globale:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}