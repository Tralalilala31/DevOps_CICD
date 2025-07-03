
# 📦 CI/CD DevOps – Gestion des Membres pour Angular Todo App

## 🎓 Cadre pédagogique

Ce projet a été réalisé dans le cadre du cours **Intégration Déploiement** à **Ynov Toulouse**, au sein de la promotion **MAST1 DEVLMIOT**, sous la supervision de **Monsieur ALLAINMAT**.  
L'objectif pédagogique est de maîtriser les processus CI/CD, la containerisation Docker, et l'automatisation des tests et déploiements sur serveur distant via GitHub Actions.

---

## 🎯 Objectif du projet

Le projet consiste à étendre une application Angular existante pour y intégrer une **gestion complète des membres** (ajout, édition, suppression) via un backend Node.js et une base MySQL, avec les objectifs suivants :

- Mise en place d’une architecture **microservices** en containers
- Gestion de la **base de données via Prisma**
- Création d’un pipeline **CI/CD** automatisé avec **GitHub Actions**
- **Dockerisation** complète de la stack (frontend, backend, BDD)
- Déploiement sur un **VPS distant** avec vérification des services via healthcheck
- Notification via **webhook** en cas de succès ou d’échec

---

## 🧱 Architecture du projet

```
project-root/
│
├── front-end/                  # Application Angular (todo + gestion membres)
├── back-end/                   # API Node.js/Express (CRUD utilisateurs)
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── .github/workflows/ci-cd.yml
└── .env.template               # Modèle de variables d’environnement
```

---

## ⚙️ Technologies utilisées

| Côté | Stack |
|------|-------|
| Frontend | Angular 19, TypeScript |
| Backend | Node.js, Express, Prisma, TypeScript |
| Base de données | MySQL (via Docker) |
| CI/CD | GitHub Actions |
| Conteneurisation | Docker, Docker Compose |
| Monitoring | Healthcheck HTTP + Webhook |
| Sécurité | GitHub Secrets, gestion des ports, backup auto |

---

## 👥 Équipe projet

| Nom               | Rôle principal                                     | Contributions clés                                        |
|--------------------|---------------------------------------------------|------------------------------------------------------------|
| **Anas DAOUI**     | Développeur Frontend Angular                      | Gestion des membres, routing, formulaires réactifs, cards |
| **Minh**           | Git & CI/CD                                       | Création des workflows GitHub Actions, structure Git      |
| **Clément**        | Base de données                                   | Modélisation Prisma, migrations, liaison BDD              |
| **Émile**          | Sécurité                                          | GitHub Secrets, scan images, verrouillage des ports       |
| **Nathan**         | Développeur Backend Node.js                       | API REST, tests unitaires, gestion des routes, cards API  |
| **Nicolas**        | Conteneurisation (Docker)                         | Dockerfiles, Docker Compose, orchestration réseau         |

🔄 Tous les membres ont collaboré de manière transversale sur la validation des tests, l'intégration des environnements et les déploiements.

---

## 🚀 Déploiement

Les environnements sont déployés automatiquement sur un VPS via SSH :

- 🔁 Staging : [http://212.83.130.245:3000](http://212.83.130.245:3000)
- ✅ Production : [http://212.83.130.245:4000](http://212.83.130.245:4000)

Des ports spécifiques sont attribués à chaque environnement (3000/80/8080 pour staging, 4000/4001/4002 pour production).

---

## 🧪 CI/CD Pipeline (GitHub Actions)

Le pipeline `ci-cd.yml` (voir `.github/workflows/`) gère les étapes suivantes :

- `build_frontend` : build Angular via Docker Compose
- `build_test_backend` : build + tests unitaires + intégration backend
- `perf_tests` : tests de performance automatisés
- `e2e_tests` : tests end-to-end (cron chaque soir à 22h)
- `deploy_staging` : déploiement sur serveur de test
- `deploy_production` : déploiement final
- `notify_webhook_*` : notification webhook en cas de succès ou d’échec

🧠 **Déclencheurs :**
```yaml
on:
  push:
    branches: ["**"]
  pull_request:
    branches: ["**"]
  schedule:
    - cron: "0 22 * * *"
```

📊 Un résumé visuel du pipeline est visible dans l’onglet **Actions** du dépôt.

---

## 🛠️ Développement local

### ▶️ Lancement conteneurisé (recommandé)

```bash
docker compose up -d --build
```

✅ Utilise `docker-compose.override.yml` par défaut pour le développement.

### 🔧 Lancement classique

- Backend :
```bash
cd back-end
npm install
npx prisma generate
npm run dev
```

- Frontend :
```bash
cd front-end
npm install
ng serve
```

---

## 📝 Bonnes pratiques Git

- Branches nommées selon convention : `feature/*`, `fix/*`, `main`, `develop`
- Merge via Pull Requests
- Commits clairs, formatés, et fréquents
- Secrets gérés dans GitHub Secrets uniquement

---

## 📌 Notes supplémentaires

- La gestion dynamique des ports est incluse dans les étapes de déploiement
- Un fallback automatique est prévu en cas d’échec du démarrage (3 tentatives)
- Des backups automatiques de la base de données sont réalisés avant production

---

## 🔐 Sécurité & Monitoring

- URL Webhook :
- Healthcheck API : `/health`
- Webhooks de notification : succès/échec
- Protection des ports avec `fuser` et `ss`
- Backup DB et services via `mysqldump`
- Scanning des images Docker (à venir via `Trivy`)

---

## 🧾 Liens utiles

- 📁 Repo GitHub : [`DevOps_CICD`](https://github.com/Tralalilala31/DevOps_CICD.git)
- 🌐 Staging : [http://212.83.130.245:3000](http://212.83.130.245:3000)
- 🌐 Production : [http://212.83.130.245:4000](http://212.83.130.245:4000)

---

**Projet réalisé dans un cadre pédagogique. Ne pas utiliser tel quel en production sans audit sécurité.**
