/*
  Warnings:

  - You are about to drop the column `dateEnvoi` on the `Facture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "dateEnvoi",
ALTER COLUMN "statutPaiement" DROP NOT NULL;
