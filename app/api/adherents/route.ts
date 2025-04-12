import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const adherents = await prisma.famille.findMany({
    include: {
      chefFamille: true, cotisation: {
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
    },
  });
  console.log("Adherents", adherents);
  const mapped = adherents.map((a) => ({
    id: a.id,
    nom: a.chefFamille?.nom || "",
    prenom: a.chefFamille?.prenom || "",
    cotisation: a.cotisation,
    adresse: a.adresse,
    adresseEmail: a.adresseEmail,
    telephone: a.telephone,
  }));

  console.log("Adherents", mapped);
  return NextResponse.json(mapped);
}