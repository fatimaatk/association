/*
  Warnings:

  - Added the required column `associationId` to the `Cotisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `associationId` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `associationId` to the `Famille` table without a default value. This is not possible if the table is not empty.
  - Added the required column `associationId` to the `Membre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `associationId` to the `TypeFamille` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cotisation" ADD COLUMN     "associationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "associationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Famille" ADD COLUMN     "associationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Membre" ADD COLUMN     "associationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TypeFamille" ADD COLUMN     "associationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Association" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Compte_email_key" ON "Compte"("email");

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeFamille" ADD CONSTRAINT "TypeFamille_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membre" ADD CONSTRAINT "Membre_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
