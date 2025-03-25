/*
  Warnings:

  - The `typePaiement` column on the `Facture` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statutPaiement` column on the `Facture` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `dateNaissance` on table `Membre` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('ACQUITTE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "TypePaiement" AS ENUM ('ESPECE', 'VIREMENT', 'CHEQUE');

-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "typePaiement",
ADD COLUMN     "typePaiement" "TypePaiement",
DROP COLUMN "statutPaiement",
ADD COLUMN     "statutPaiement" "StatutPaiement";

-- AlterTable
ALTER TABLE "Membre" ALTER COLUMN "dateNaissance" SET NOT NULL;
