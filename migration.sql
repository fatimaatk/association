-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('ACQUITTE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "TypePaiement" AS ENUM ('ESPECE', 'VIREMENT', 'CHEQUE');

-- CreateEnum
CREATE TYPE "StatutMembre" AS ENUM ('ACTIF', 'INACTIF', 'ARCHIVE');

-- CreateTable
CREATE TABLE "Association" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "description" TEXT,
    "reseauxSociaux" TEXT,
    "siteWeb" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Association_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compte" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "associationId" TEXT NOT NULL,

    CONSTRAINT "Compte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeFamille" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "associationId" TEXT NOT NULL,

    CONSTRAINT "TypeFamille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Famille" (
    "id" TEXT NOT NULL,
    "typeFamilleId" TEXT NOT NULL,
    "chefFamilleId" TEXT NOT NULL,
    "adresse" TEXT NOT NULL DEFAULT '',
    "adresseEmail" TEXT NOT NULL DEFAULT '',
    "telephone" TEXT NOT NULL DEFAULT '',
    "associationId" TEXT NOT NULL,

    CONSTRAINT "Famille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "dateEntree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSortie" TIMESTAMP(3),
    "statut" "StatutMembre" NOT NULL DEFAULT 'ACTIF',
    "annee" INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    "associationId" TEXT NOT NULL,
    "familleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotisation" (
    "id" TEXT NOT NULL,
    "familleId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "associationId" TEXT NOT NULL,

    CONSTRAINT "Cotisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "cotisationId" TEXT NOT NULL,
    "typePaiement" "TypePaiement",
    "statutPaiement" "StatutPaiement",
    "datePaiement" TIMESTAMP(3),
    "associationId" TEXT NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compte_email_key" ON "Compte"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TypeFamille_nom_associationId_key" ON "TypeFamille"("nom", "associationId");

-- CreateIndex
CREATE UNIQUE INDEX "Famille_chefFamilleId_key" ON "Famille"("chefFamilleId");

-- CreateIndex
CREATE UNIQUE INDEX "Cotisation_familleId_key" ON "Cotisation"("familleId");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_cotisationId_key" ON "Facture"("cotisationId");

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeFamille" ADD CONSTRAINT "TypeFamille_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_typeFamilleId_fkey" FOREIGN KEY ("typeFamilleId") REFERENCES "TypeFamille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_chefFamilleId_fkey" FOREIGN KEY ("chefFamilleId") REFERENCES "Membre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membre" ADD CONSTRAINT "Membre_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membre" ADD CONSTRAINT "Membre_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_cotisationId_fkey" FOREIGN KEY ("cotisationId") REFERENCES "Cotisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

