import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user?.associationId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
  }

  const adherents = await prisma.famille.findMany({
    where: { associationId: user.associationId },
    include: {
      chefFamille: true,
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
    },
  })

  const mapped = adherents.map((a) => ({
    id: a.id,
    nom: a.chefFamille?.nom || "",
    prenom: a.chefFamille?.prenom || "",
    cotisation: a.cotisation,
    adresse: a.adresse,
    adresseEmail: a.adresseEmail,
    telephone: a.telephone,
  }))

  return NextResponse.json(mapped)
}
