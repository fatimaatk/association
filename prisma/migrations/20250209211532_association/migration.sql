-- CreateTable
CREATE TABLE "Statut" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Statut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeFamille" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "TypeFamille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "statutId" TEXT NOT NULL,
    "familleId" TEXT,

    CONSTRAINT "Membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Famille" (
    "id" TEXT NOT NULL,
    "typeFamilleId" TEXT NOT NULL,
    "representantId" TEXT NOT NULL,

    CONSTRAINT "Famille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotisation" (
    "id" TEXT NOT NULL,
    "familleId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cotisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "cotisationId" TEXT NOT NULL,
    "typePaiement" TEXT,
    "statutPaiement" TEXT NOT NULL,
    "datePaiement" TIMESTAMP(3),
    "dateEnvoi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Statut_nom_key" ON "Statut"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "TypeFamille_nom_key" ON "TypeFamille"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Famille_representantId_key" ON "Famille"("representantId");

-- CreateIndex
CREATE UNIQUE INDEX "Cotisation_familleId_key" ON "Cotisation"("familleId");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_cotisationId_key" ON "Facture"("cotisationId");

-- AddForeignKey
ALTER TABLE "Membre" ADD CONSTRAINT "Membre_statutId_fkey" FOREIGN KEY ("statutId") REFERENCES "Statut"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membre" ADD CONSTRAINT "Membre_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_typeFamilleId_fkey" FOREIGN KEY ("typeFamilleId") REFERENCES "TypeFamille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Famille" ADD CONSTRAINT "Famille_representantId_fkey" FOREIGN KEY ("representantId") REFERENCES "Membre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotisation" ADD CONSTRAINT "Cotisation_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_cotisationId_fkey" FOREIGN KEY ("cotisationId") REFERENCES "Cotisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
