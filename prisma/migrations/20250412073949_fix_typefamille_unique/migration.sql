/*
  Warnings:

  - A unique constraint covering the columns `[nom,associationId]` on the table `TypeFamille` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TypeFamille_nom_key";

-- CreateIndex
CREATE UNIQUE INDEX "TypeFamille_nom_associationId_key" ON "TypeFamille"("nom", "associationId");
