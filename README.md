# 🧾 Association – Gestion des familles et factures

## 📌 Description

Application web permettant de gérer les familles et leurs factures au sein d'une association. Elle inclut des fonctionnalités d'importation de données, de génération de documents PDF et une interface simple d’administration.

---

## 🚀 Fonctionnalités

- 🏠 Page d'accueil
- 👨‍👩‍👧‍👦 Gestion des familles :
  - Ajouter / modifier / supprimer une famille
  - Afficher le détail d'une famille
- 📄 Gestion des factures :
  - Génération d’attestations de paiement
  - Mise en page et édition de factures PDF
- 📥 Importation via fichier Excel
- 🔍 API REST
- 🛠 Base de données Prisma avec migrations

---

## 🏗️ Technologies utilisées

- **Next.js** – Framework React
- **TypeScript** – Typage statique
- **Prisma** – ORM (PostgreSQL ou MySQL)
- **Tailwind CSS** – Framework CSS
- **Docker** – Conteneurisation (optionnel)
- **GitHub** – Code source et gestion de version

---

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/fatimaatk/association.git
cd association
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configurer la base de données

Créer un fichier `.env` et renseigner l’URL de connexion à la base :

```env
DATABASE_URL="mysql://user:password@localhost:3306/nom_de_la_db"
```

Puis exécuter les migrations Prisma :

```bash
npx prisma migrate dev --name init
```

### 4. Lancer l’application

```bash
npm run dev
# ou
yarn dev
```

📍 L’application est disponible sur : http://localhost:3000

---

## 📥 Exemple de fichier d'import

Un fichier Excel d’exemple est disponible pour tester l’importation :

📂 **Emplacement** : `samples/exemple_fichier_import.xlsx`  
🔗 [Télécharger le fichier d'exemple](./samples/exemple_fichier_import.xlsx)

Le fichier contient :

- **Familles** : 20 familles (avec ou sans membres selon leur type)
- **Membres** : uniquement pour les familles de type `Famille`
- **Data** : feuille explicative de la structure attendue

📌 L’identifiant de chaque famille (`id`) est au format :

```txt
nom_prenom_anneedenaissance
```

Exemple : `dupont_marie_1980`

---

### ✅ Types attendus

#### 🧍‍ Types de famille

- `Célibataire` → 1 membre = Chef de famille
- `Famille` → entre 1 et 3 membres

#### 💳 Enums pour les paiements

```ts
export enum TypePaiement {
  ESPECE = 'ESPECE',
  VIREMENT = 'VIREMENT',
  CHEQUE = 'CHEQUE',
}

export enum StatutPaiement {
  ACQUITTE = 'ACQUITTE',
  EN_ATTENTE = 'EN_ATTENTE',
}
```

---

🐳 Utilisation avec Docker (optionnel)
Tu peux exécuter l'application dans un conteneur Docker pour faciliter le déploiement :

🏗️ Construction de l’image

```bash
docker build -t association-app .
```

🚀 Lancement du conteneur

```bash
docker run -d -p 3000:3000 --env-file .env association-app
```

👉 L'application sera accessible sur http://localhost:3000

---

## 🤝 Contribution

1. Fork le repo
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m "Nouvelle fonctionnalité"`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request 🙌

---

## 📄 Licence

MIT

---

Développé avec ❤️ par Fatima
