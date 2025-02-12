/*
  Warnings:

  - You are about to drop the column `statutId` on the `Membre` table. All the data in the column will be lost.
  - You are about to drop the `Statut` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Membre" DROP CONSTRAINT "Membre_statutId_fkey";

-- AlterTable
ALTER TABLE "Membre" DROP COLUMN "statutId";

-- DropTable
DROP TABLE "Statut";
