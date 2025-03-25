# Étape 1 : Image officielle Node.js
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail dans le container
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le code source
COPY . .

# Etape 5.1 Copier .env 
COPY .env .env

# Étape 6 : Générer le client Prisma
RUN npx prisma generate --no-engine

# Étape 7 : Build de l'application
RUN npm run build

# Étape 8 : Exposer le port
EXPOSE 3000

# Étape 9 : Commande de démarrage
CMD ["npm", "start"]
