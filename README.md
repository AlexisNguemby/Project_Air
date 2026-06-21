# Project Air 🃏

The new-generation TCG is coming soon.

<img width="1280" height="800" alt="Wallpaper" src="https://github.com/user-attachments/assets/a045428f-2fe0-43fe-9ac4-bb2fcf985229" />

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/AlexisNguemby/Project_Air.git
cd Project_Air
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Copie le fichier d'exemple et remplis les valeurs :

```bash
cp .env.example .env
```

Contenu du `.env` à remplir :

```env
DATABASE_URL="mysql://project_air_user:project_air_password_change_me@localhost:3307/project_air"

DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_USER=project_air_user
DATABASE_PASSWORD=project_air_password_change_me
DATABASE_NAME=project_air

JWT_SECRET=remplace_par_une_valeur_aleatoire_longue

NODE_ENV=development

MYSQL_ROOT_PASSWORD=root_password_change_me
MYSQL_DATABASE=project_air
MYSQL_USER=project_air_user
MYSQL_PASSWORD=project_air_password_change_me
MYSQL_PORT=3307
PHPMYADMIN_PORT=8080
```

Pour générer un JWT_SECRET sécurisé :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Lancer la base de données

```bash
docker compose up -d
```

phpMyAdmin disponible sur : http://localhost:8080

### 5. Initialiser les données

Ouvre phpMyAdmin (`http://localhost:8080`), sélectionne la base `project_air`, onglet **SQL**, et exécute :

```sql
INSERT IGNORE INTO Role (role_name) VALUES ('player');
INSERT IGNORE INTO Class (class_name, battling) VALUES ('novice', FALSE);
```

### 6. Lancer le serveur

```bash
npx tsc && node dist/index.js
```

Le serveur démarre sur : http://localhost:3000

---

## Fonctionnalités disponibles

### Authentification

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/auth/register` | ❌ | Créer un compte |
| POST | `/auth/login` | ❌ | Se connecter |
| GET | `/auth/me` | ✅ JWT | Voir son profil |

#### POST /auth/register

```json
{
  "account_name": "Alexis",
  "mail": "alexis@exemple.com",
  "password": "MonMotDePasse1!"
}
```

Règles :
- Pseudonyme : 3 à 30 caractères, lettres/chiffres/`_`/`-` uniquement, pas de caractères spéciaux
- Email : format valide
- Mot de passe : 8+ caractères, au moins 1 chiffre et 1 caractère spécial

Réponse `201` :
```json
{
  "message": "Compte créé avec succès !",
  "token": "eyJhbGci...",
  "account": { "id": 1, "name": "Alexis", "mail": "alexis@exemple.com" }
}
```

#### POST /auth/login

```json
{
  "mail": "alexis@exemple.com",
  "password": "MonMotDePasse1!"
}
```

Réponse `200` :
```json
{
  "message": "Connexion réussie !",
  "token": "eyJhbGci...",
  "account": { "id": 1, "name": "Alexis", "mail": "alexis@exemple.com" }
}
```

#### GET /auth/me

Ajouter dans le header :
```
Authorization: Bearer <votre_token>
```

Réponse `200` :
```json
{
  "account": {
    "account_id": 1,
    "account_name": "Alexis",
    "mail": "alexis@exemple.com",
    "level": 1,
    "experience": 0,
    "xp_max": 100,
    "power": 0,
    "avatar": null,
    "createdAt": "2026-06-21T..."
  }
}
```

---

## Structure du projet

```
Project_Air/
├── src/
│   ├── index.ts                        ← Serveur principal
│   ├── plugins/
│   │   ├── prisma.plugin.ts            ← Connexion base de données
│   │   └── jwt.plugin.ts               ← Authentification JWT
│   └── modules/
│       └── auth/
│           ├── auth.schema.ts          ← Règles de validation
│           ├── auth.service.ts         ← Logique métier
│           └── auth.routes.ts          ← Routes HTTP
├── prisma/
│   └── schema.prisma                   ← Schéma base de données
├── docker-compose.yml                  ← MySQL + phpMyAdmin
├── .env.example                        ← Modèle de configuration
└── tsconfig.json
```

---

## Tester avec Thunder Client (VS Code)

1. Installe l'extension **Thunder Client** dans VS Code
2. Lance le serveur
3. Crée une requête `POST http://localhost:3000/auth/register` avec un body JSON
4. Copie le `token` reçu
5. Pour les routes protégées : onglet **Auth** → **Bearer** → colle le token

---

## Notes

- Le token JWT est valide **7 jours**
- Ne commite jamais ton `.env` — il est dans `.gitignore`
- En cas de Foreign Key error au premier register, vérifie que les données initiales (étape 5) ont bien été insérées
