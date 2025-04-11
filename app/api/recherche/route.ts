import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ message: "Paramètre 'q' requis" }, { status: 400 });
  }

  try {
    const familles = await prisma.famille.findMany({
      include: { chefFamille: true },
    });

    const query = q.toLowerCase();

    const resultats = familles.filter((famille) => {
      return (
        famille.chefFamille?.nom?.toLowerCase().includes(query) ||
        famille.chefFamille?.prenom?.toLowerCase().includes(query) ||
        famille.adresse?.toLowerCase().includes(query) ||
        famille.adresseEmail?.toLowerCase().includes(query)
      );
    });

    return NextResponse.json(resultats);
  } catch (error) {
    console.error("Erreur dans l'API /recherche :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
