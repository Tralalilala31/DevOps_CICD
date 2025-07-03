# 📦 DevOps CI/CD – Gestion des Membres

## 🎓 Cadre pédagogique

Ce projet a été réalisé dans le cadre du cours **Intégration Déploiement** à **Ynov Toulouse**, au sein de la promotion **MAST1 DEVLMIOT**, sous la supervision de **Monsieur ALLAINMAT**.  
L'objectif pédagogique est de maîtriser les processus CI/CD, la containerisation Docker, et l'automatisation des tests et déploiements sur serveur distant via GitHub Actions.

---

## 🎯 Objectif du projet

Le projet consiste à étendre une application Angular existante pour y intégrer une **gestion complète des membres** (ajout, édition, suppression) via un backend Node.js et une base MySQL, avec les objectifs suivants :

- Mise en place d’une architecture **microservices** en containers
- Gestion de la **base de données via Sequelize**
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

| Côté             | Stack                                          |
| ---------------- | ---------------------------------------------- |
| Frontend         | Angular 19, TypeScript                         |
| Backend          | Node.js, Express, Sequelize, TypeScript        |
| Base de données  | MySQL (via Docker)                             |
| CI/CD            | GitHub Actions                                 |
| Conteneurisation | Docker, Docker Compose                         |
| Monitoring       | Healthcheck HTTP + Webhook                     |
| Sécurité         | GitHub Secrets, gestion des ports, backup auto |

---

## 👥 Équipe projet

| Nom            | Rôle principal               | Contributions clés                                        |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| **Anas DAOUI** | Développeur Frontend Angular | Gestion des membres, routing, formulaires réactifs, cards |
| **Minh**       | Git & CI/CD                  | Création des workflows GitHub Actions, structure Git      |
| **Clément**    | Base de données              | Modélisation Sequelize, migrations, liaison BDD           |
| **Émile**      | Sécurité                     | GitHub Secrets, scan images, verrouillage des ports       |
| **Nathan**     | Développeur Backend Node.js  | API REST, tests unitaires, gestion des routes, cards API  |
| **Nicolas**    | Conteneurisation (Docker)    | Dockerfiles, Docker Compose, orchestration réseau         |

🔄 Tous les membres ont collaboré de manière transversale sur la validation des tests, l'intégration des environnements et les déploiements.

---

## 🚀 Déploiement

Les environnements sont déployés automatiquement sur un VPS via SSH :

- 🔁 Staging : [http://212.83.130.245:81](http://212.83.130.245:81)
- ✅ Production : [http://212.83.130.245:80](http://212.83.130.245:80)

Des ports spécifiques sont attribués à chaque environnement (Frontend: 81, Backend: 3001, PhpMyAdmin: 8081 pour staging / Frontend: 80, Backend: 3000, PhpMyAdmin: 8080 pour production).

---

## 🧪 CI/CD Pipeline (GitHub Actions)

Le pipeline `ci-cd.yml` (voir `.github/workflows/`) gère les étapes suivantes :

- `test_webhook` : test de connectivité webhook
- `backend_tests` : build + tests unitaires backend
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

- URL Webhook : `https://webhook.site/ffed736a-8eec-4ddb-818d-c1ae3e2c8648`
- Healthcheck API : `/health`
- Webhooks de notification : succès/échec
- Protection des ports avec `fuser` et `ss`
- Backup DB et services via `mysqldump`
- Configuration sécurisée via GitHub Secrets

---

## 🧾 Liens utiles

- 📁 Repo GitHub : [`DevOps_CICD`](https://github.com/Tralalilala31/DevOps_CICD.git)
- 🌐 Staging : [http://212.83.130.245:81](http://212.83.130.245:81)
- 🌐 Production : [http://212.83.130.245:80](http://212.83.130.245:80)

---

**Projet réalisé dans un cadre pédagogique. Ne pas utiliser tel quel en production sans audit sécurité.**
