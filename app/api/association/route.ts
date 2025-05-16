import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nom,
      adresse,
      siret,
      type,
      email,
      telephone,
      compte, // { email, motDePasse, nom, prenom }
    } = body;

    if (!nom || !email || !compte?.email || !compte?.motDePasse) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    // Recherche des conflits
    const existingByEmail = await prisma.association.findFirst({ where: { email } });
    const existingBySiret = await prisma.association.findFirst({ where: { siret } });
    const existingByNom = await prisma.association.findFirst({ where: { nom } });

    const fields: string[] = [];
    if (existingByEmail) fields.push("email");
    if (existingBySiret) fields.push("siret");
    if (existingByNom) fields.push("nom");

    if (fields.length > 0) {
      return NextResponse.json(
        {
          message: "Un compte existe déjà avec ces informations.",
          fields,
          email: existingByEmail?.email,
          siret: existingBySiret?.siret,
          nom: existingByNom?.nom,
        },
        { status: 409 }
      );
    }

    const existingCompte = await prisma.compte.findUnique({
      where: { email: compte.email },
    });

    if (existingCompte) {
      return NextResponse.json({ message: 'Ce compte existe déjà' }, { status: 409 });
    }

    const hashedPassword = await hash(compte.motDePasse, 10);

    const association = await prisma.association.create({
      data: {
        nom,
        adresse,
        siret,
        type,
        email,
        telephone,
        comptes: {
          create: {
            email: compte.email,
            motDePasse: hashedPassword,
            nom: compte.nom,
            prenom: compte.prenom,
          },
        },
      },
      include: {
        comptes: {
          where: { email: compte.email },
          select: { id: true },
        },
      },
    });

    const token = jwt.sign(
      {
        email: compte.email,
        associationId: association.id,
        compteId: association.comptes[0].id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Optionnel : envoyer le token aussi en cookie
    const response = NextResponse.json({ success: true, token }, { status: 201 });
    response.headers.set('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);

    return response;
  } catch (error) {
    console.error('Erreur lors de la création de l’association :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
