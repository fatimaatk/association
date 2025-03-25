import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const membres = await prisma.membre.findMany({})

    if (!membres) {
      return NextResponse.json({ error: "Membre non trouvé" }, { status: 404 })
    }

    return NextResponse.json(membres)
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    return NextResponse.json({ error: error, }, { status: 500 })
  }
}
