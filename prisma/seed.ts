const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 🚨 Supprimer les données existantes (ordre inverse des relations)
  await prisma.facture.deleteMany();
  await prisma.cotisation.deleteMany();
  await prisma.famille.deleteMany();
  await prisma.membre.deleteMany();
  await prisma.compte.deleteMany();
  await prisma.typeFamille.deleteMany();
  await prisma.association.deleteMany();

  console.log('🧹 Données précédentes supprimées');

  const hashPassword = async (password: string): Promise<string> =>
    await bcrypt.hash(password, 10);

  type AssociationSeedInput = {
    nom: string;
    email: string;
    adminEmail: string;
    adminPassword: string;
    membresSupp?: { nom: string; prenom: string; dateNaissance: string }[];
  };

  const createAssociationWithData = async ({
    nom,
    email,
    adminEmail,
    adminPassword,
    membresSupp = [],
  }: AssociationSeedInput): Promise<void> => {
    const association = await prisma.association.create({
      data: {
        nom,
        adresse: 'Adresse auto',
        siret: Math.floor(Math.random() * 10000000000000).toString(),
        type: 'Association',
        email,
        telephone: '0000000000',
      },
    });

    await prisma.compte.create({
      data: {
        email: adminEmail,
        motDePasse: await hashPassword(adminPassword),
        nom: 'Admin',
        prenom: nom,
        associationId: association.id,
      },
    });

    // ✅ Créer les types "Individuel" et "Famille" pour cette association
    const typeIndividuel = await prisma.typeFamille.create({
      data: {
        nom: 'Individuel',
        associationId: association.id,
      },
    });

    const typeFamille = await prisma.typeFamille.create({
      data: {
        nom: 'Famille',
        associationId: association.id,
      },
    });

    const chef = await prisma.membre.create({
      data: {
        nom: 'Test',
        prenom: 'Responsable',
        dateNaissance: '1980-01-01',
        associationId: association.id,
      },
    });

    const autresMembres = await Promise.all(
      membresSupp.map((m) =>
        prisma.membre.create({
          data: {
            nom: m.nom,
            prenom: m.prenom,
            dateNaissance: m.dateNaissance,
            associationId: association.id,
          },
        })
      )
    );

    const tousLesMembres = [chef, ...autresMembres];
    const typeFamilleId = tousLesMembres.length > 1 ? typeFamille.id : typeIndividuel.id;

    const famille = await prisma.famille.create({
      data: {
        chefFamilleId: chef.id,
        typeFamilleId,
        associationId: association.id,
        adresse: 'Adresse famille',
        adresseEmail: 'famille@email.com',
        telephone: '0102030405',
        membres: {
          connect: tousLesMembres.map((m) => ({ id: m.id })),
        },
      },
    });

    const cotisation = await prisma.cotisation.create({
      data: {
        familleId: famille.id,
        montant: 99,
        associationId: association.id,
      },
    });

    await prisma.facture.create({
      data: {
        cotisationId: cotisation.id,
        typePaiement: 'VIREMENT',
        statutPaiement: 'ACQUITTE',
        datePaiement: new Date(),
        associationId: association.id,
      },
    });

    console.log(`✅ Données insérées pour ${nom}`);
  };

  await createAssociationWithData({
    nom: 'Association Alpha',
    email: 'alpha@email.com',
    adminEmail: 'admin@alpha.com',
    adminPassword: 'alpha123',
    membresSupp: [], // → type Individuel
  });

  await createAssociationWithData({
    nom: 'Association Beta',
    email: 'beta@email.com',
    adminEmail: 'admin@beta.com',
    adminPassword: 'beta123',
    membresSupp: [
      {
        nom: 'Martin',
        prenom: 'Claire',
        dateNaissance: '2012-06-03',
      },
    ], // → type Famille
  });

  console.log('🎉 Seed terminé');
}

main()
  .catch((e: any) => {
    console.error('❌ Erreur dans le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
