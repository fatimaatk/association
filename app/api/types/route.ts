
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    const types = await prisma.typeFamille.findMany({
      select: {
        id: true,
        nom: true,
      }
    });

    if (!types) {
      return NextResponse.json({ error: "Types de famille non trouvée" }, { status: 404 })
    }

    return NextResponse.json(types)
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    return NextResponse.json({ error: "Erreur lors du chargement des données", }, { status: 500 })
  }
}


