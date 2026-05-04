# Backend PDF Marketplace

Backend Express.js + TypeORM + MySQL pour une application de documents PDF gratuits et payants.

## Technologies

- Express.js
- TypeScript
- TypeORM
- MySQL avec WAMP Server
- JWT stocke dans un cookie httpOnly
- bcryptjs pour chiffrer les mots de passe
- Multer pour upload PDF

## Architecture

Les controllers appellent maintenant les services.

```txt
src/
  controllers/   # Recoit req/res et retourne les reponses HTTP
  services/      # Contient la logique metier
  entities/      # Entites TypeORM
  routes/        # Routes Express
  middlewares/   # Auth, upload, erreurs
  utils/         # Fonctions utilitaires
```

Exemple:

```ts
// controller
const user = await getMeService(req.user!.id);
res.json({ success: true, user });
```

```ts
// service
export const getMeService = async (userId: number) => {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) throw new AppError("Utilisateur introuvable", 404);
  return sanitizeUser(user);
};
```

## Fonctionnalites

- Inscription avec email + mot de passe chiffre
- Connexion avec email + mot de passe
- Session JWT stockee dans un cookie httpOnly
- Deconnexion avec suppression du cookie
- Roles: `user` et `admin`
- Gestion profil utilisateur
- Gestion categories
- Upload de documents PDF
- Documents gratuits et documents payants
- Lecture PDF dans l'application sans telechargement avec `/view`
- Telechargement PDF avec `/download`
- Verification d'acces aux documents payants
- Achat simule d'un document payant
- Paiements enregistres
- Commentaires et notes
- Calcul de la moyenne des notes
- Favoris
- Administration utilisateurs, categories, paiements et achats

## Installation

```bash
npm install
```

Copiez le fichier d'environnement:

```bash
cp .env.example .env
```

Sur Windows PowerShell, utilisez plutot:

```powershell
copy .env.example .env
```

## Configuration WAMP Server

Demarrez WAMP Server, puis verifiez que l'icone WAMP est verte.

Dans phpMyAdmin, creez la base:

```sql
CREATE DATABASE pdf_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configuration recommandee dans `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=pdf_app
DB_SYNCHRONIZE=true
```

Si votre WAMP utilise MariaDB sur le port `3307`, changez seulement:

```env
DB_PORT=3307
```

## Lancer le serveur

```bash
npm run dev
```

API disponible sur:

```txt
http://localhost:3000
```

## Creer les categories et un admin

```bash
npm run seed
```

Admin par defaut:

```txt
admin@example.com
admin123
```

Vous pouvez changer ces valeurs dans `.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_FULL_NAME=Administrateur
```

## Routes principales

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

Register body:

```json
{
  "fullName": "Saber Tebri",
  "email": "saber@example.com",
  "password": "123456"
}
```

Login body:

```json
{
  "email": "saber@example.com",
  "password": "123456"
}
```

Le backend met automatiquement un cookie `access_token` en `httpOnly`.
Le token JWT n'est pas renvoye dans le JSON: il reste dans le cookie.

Exemple frontend pour se connecter:

```ts
await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "saber@example.com",
    password: "123456",
  }),
});
```

Pour les routes protegees, ajoutez toujours `credentials: "include"`:

```ts
const response = await fetch("http://localhost:3000/api/users/me", {
  credentials: "include",
});
```

Pour se deconnecter:

```ts
await fetch("http://localhost:3000/api/auth/logout", {
  method: "POST",
  credentials: "include",
});
```

### Utilisateurs

```txt
GET   /api/users/me
PATCH /api/users/me
PATCH /api/users/me/password
GET   /api/users                 admin
PATCH /api/users/:id/active      admin
```

### Categories

```txt
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories           admin
PATCH  /api/categories/:id       admin
DELETE /api/categories/:id       admin
```

### Documents

```txt
GET    /api/documents
GET    /api/documents/mine                 connecte
GET    /api/documents/:id
GET    /api/documents/:id/view             lecture dans l'application
GET    /api/documents/:id/download         telechargement
POST   /api/documents                      connecte, multipart/form-data
PATCH  /api/documents/:id                  proprietaire ou admin
DELETE /api/documents/:id                  proprietaire ou admin
```

Upload document avec `multipart/form-data`:

```txt
pdf: fichier.pdf
title: Titre du document
description: Description
categoryId: 1
isFree: true
price: 0
```

Pour document payant:

```txt
isFree: false
price: 500
```

### Achats

```txt
POST /api/purchases/documents/:documentId/buy
GET  /api/purchases/me
GET  /api/purchases              admin
```

### Paiements

```txt
GET /api/payments/me
GET /api/payments                 admin
```

### Commentaires

```txt
GET    /api/documents/:documentId/comments
POST   /api/documents/:documentId/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

### Favoris

```txt
GET    /api/favorites/me
POST   /api/favorites/documents/:documentId
DELETE /api/favorites/documents/:documentId
```

## Lecture PDF dans le frontend

Pour un document gratuit:

```html
<iframe src="http://localhost:3000/api/documents/1/view" width="100%" height="700"></iframe>
```

Pour un document payant, le navigateur envoie le cookie `access_token` au backend. Si le document est payant, le backend verifie la table `purchases` avant de renvoyer le PDF.

En local, utilisez le meme hostname pour le front et le backend, par exemple `localhost` pour les deux.

En production avec deux domaines differents, utilisez HTTPS et mettez:

```env
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_SECURE=true
```

Exemple React avec cookie:

```ts
const response = await fetch("http://localhost:3000/api/documents/1/view", {
  credentials: "include",
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
setPdfUrl(url);
```
