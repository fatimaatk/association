/*
  Warnings:

  - The values [SORTI] on the enum `StatutMembre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatutMembre_new" AS ENUM ('ACTIF', 'INACTIF', 'ARCHIVE');
ALTER TABLE "Membre" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Membre" ALTER COLUMN "statut" TYPE "StatutMembre_new" USING ("statut"::text::"StatutMembre_new");
ALTER TYPE "StatutMembre" RENAME TO "StatutMembre_old";
ALTER TYPE "StatutMembre_new" RENAME TO "StatutMembre";
DROP TYPE "StatutMembre_old";
ALTER TABLE "Membre" ALTER COLUMN "statut" SET DEFAULT 'ACTIF';
COMMIT;
