/*
  Warnings:

  - The `dateNaissance` column on the `Membre` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Membre" DROP COLUMN "dateNaissance",
ADD COLUMN     "dateNaissance" INTEGER;
