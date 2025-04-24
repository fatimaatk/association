import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user?.associationId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ message: "Paramètre 'q' requis" }, { status: 400 });
  }

  const query = q.toLowerCase();

  try {
    const familles = await prisma.famille.findMany({
      where: {
        associationId: user.associationId,
        OR: [
          { chefFamille: { nom: { contains: query, mode: 'insensitive' } } },
          { chefFamille: { prenom: { contains: query, mode: 'insensitive' } } },
          { adresse: { contains: query, mode: 'insensitive' } },
          { adresseEmail: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { chefFamille: true },
    });

    return NextResponse.json(familles);
  } catch (error) {
    console.error("Erreur dans l'API /recherche :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
