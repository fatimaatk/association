/*
  Warnings:

  - Added the required column `updatedAt` to the `Membre` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dateNaissance` on the `Membre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatutMembre" AS ENUM ('ACTIF', 'INACTIF', 'SORTI');

-- AlterTable
ALTER TABLE "Membre" ADD COLUMN     "annee" INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateEntree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateSortie" TIMESTAMP(3),
ADD COLUMN     "statut" "StatutMembre" NOT NULL DEFAULT 'ACTIF',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dateNaissance",
ADD COLUMN     "dateNaissance" TIMESTAMP(3) NOT NULL;
