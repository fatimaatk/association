/*
  Warnings:

  - You are about to drop the column `representantId` on the `Famille` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chefFamilleId]` on the table `Famille` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chefFamilleId` to the `Famille` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Famille" DROP CONSTRAINT "Famille_representantId_fkey";

-- DropIndex
DROP INDEX "Famille_representantId_key";

-- AlterTable
ALTER TABLE "Famille" DROP COLUMN "representantId",
ADD COLUMN     "chefFamilleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Famille_chefFamilleId_key" ON "Famille"("chefFamilleId");

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_chefFamilleId_fkey" FOREIGN KEY ("chefFamilleId") REFERENCES "Membre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
