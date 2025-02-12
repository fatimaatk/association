# Association - Gestion des familles et factures

## 📌 Description

Ce projet est une application web permettant de gérer les familles et leurs factures au sein d'une association. Il inclut des fonctionnalités de création, modification et suppression de familles, ainsi que la génération et l'édition de documents PDF.

## 🚀 Fonctionnalités principales

- 🏠 **Page d'accueil**
- 👨‍👩‍👧‍👦 **Gestion des familles** :
  - Ajouter une famille
  - Modifier une famille
  - Supprimer une famille
  - Afficher le détail d'une famille
- 📄 **Gestion des factures** :
  - Génération d'attestations de paiement
  - Édition et mise en page de factures
- 🔍 **API** : Routes API pour la gestion des familles et des types de données
- 🛠 **Base de données Prisma** :
  - Modélisation avec `schema.prisma`
  - Migrations Prisma pour l'évolution du modèle de données

## 🏗️ Technologies utilisées

- **Next.js** - Framework React pour le développement web
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la gestion de la base de données
- **Tailwind CSS** - Framework CSS pour le design
- **GitHub** - Hébergement du code source

## 🔧 Installation & Exécution

### 1️⃣ Cloner le projet

```bash
git clone git@github.com:fatimaatk/association.git
cd association
```

### 2️⃣ Installer les dépendances

```bash
yarn install
# ou
npm install
```

### 3️⃣ Configurer la base de données

Modifier le fichier `.env` et ajouter l'URL de connexion à la base de données.

```env
DATABASE_URL="mysql://user:password@localhost:3306/nom_de_la_db"
```

Exécuter les migrations Prisma :

```bash
npx prisma migrate dev --name init
```

### 4️⃣ Lancer l'application

```bash
yarn dev
# ou
npm run dev
```

L'application sera disponible sur **http://localhost:3000**.
