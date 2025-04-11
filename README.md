📜 Association – Gestion des familles et factures

📌 Description

Application web permettant de gérer les familles et leurs factures au sein d'une association. Elle inclut des fonctionnalités d'importation de données, de génération de documents PDF et une interface simple d’administration.

🚀 Fonctionnalités

🏠 Page d'accueil

👨‍👩‍👧 Gestion des familles :

Ajouter / modifier / supprimer une famille

Afficher le détail d'une famille

📄 Gestion des factures :

Génération d’attestations de paiement

Mise en page et édition de factures PDF

📅 Importation via fichier Excel

🔍 API REST

🛠 Base de données Prisma avec migrations

🏗️ Technologies utilisées

Next.js – Framework React

TypeScript – Typage statique

Prisma – ORM (PostgreSQL via Docker)

Tailwind CSS – Framework CSS

Docker – Conteneurisation

GitHub – Code source et gestion de version

🔧 Installation

1. Cloner le projet

git clone https://github.com/fatimaatk/association.git
cd association

2. Installer les dépendances

npm install

# ou

yarn install

3. Configurer la base de données avec Docker

Créer un fichier .env à la racine avec ce contenu :

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/association_db"
NODE_ENV="dev"

Puis, lancer la base PostgreSQL avec Docker :

docker-compose up -d

Appliquer les migrations Prisma :

npx prisma migrate dev --name init

4. Injecter les types de familles de base

npm run seed

Ce script permet d'insérer automatiquement les types Individuel et Famille dans la table TypeFamille.

5. Lancer l’application

npm run dev

# ou

yarn dev

📍 L’application est disponible sur : http://localhost:3000

🐳 Fichier Docker Compose

Voici le fichier docker-compose.yml à placer à la racine du projet :

version: '3.8'

services:
postgres:
image: postgres:15
container_name: association-db
restart: always
ports: - "5432:5432"
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: association_db
volumes: - pgdata:/var/lib/postgresql/data

volumes:
pgdata:

📅 Exemple de fichier d'import

Un fichier Excel d’exemple est disponible pour tester l’importation :

📂 Emplacement : samples/exemple_fichier_import.xlsx🔗 Télécharger le fichier d'exemple

Le fichier contient :

Familles : 20 familles (avec ou sans membres selon leur type)

Membres : uniquement pour les familles de type Famille

Data : feuille explicative de la structure attendue

📌 L’identifiant de chaque famille (id) est au format :

nom_prenom_anneedenaissance

Exemple : dupont_marie_1980

✅ Types attendus

🣍‍ Types de famille

Individuel → 1 membre = Chef de famille

Famille → entre 1 et 3 membres

💳 Enums pour les paiements

export enum TypePaiement {
ESPECE = 'ESPECE',
VIREMENT = 'VIREMENT',
CHEQUE = 'CHEQUE',
}

export enum StatutPaiement {
ACQUITTE = 'ACQUITTE',
EN_ATTENTE = 'EN_ATTENTE',
}

🤝 Contribution

Fork le repo

Crée une branche (git checkout -b feature/ma-feature)

Commit (git commit -m "Nouvelle fonctionnalité")

Push (git push origin feature/ma-feature)

Ouvre une Pull Request 🙌

📄 Licence

MIT

Développé avec ❤️ par Fatima
