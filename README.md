# DevOps CI/CD – Gestion des Membres

## Cadre pédagogique

Ce projet a été réalisé dans le cadre du cours **Intégration Déploiement** à **Ynov Toulouse**, au sein de la promotion **MAST1 DEVLMIOT**, sous la supervision de **Monsieur ALLAINMAT**.

L'objectif pédagogique est de maîtriser les processus CI/CD, la containerisation Docker, et l'automatisation des tests et déploiements sur serveur distant via GitHub Actions.

## Objectif du projet

Le projet consiste à étendre une application Angular existante pour y intégrer une gestion complète des membres (ajout, édition, suppression) via un backend Node.js et une base MySQL, avec les objectifs suivants :

- Mise en place d'une architecture microservices en containers
- Gestion de la base de données via Sequelize
- Création d'un pipeline CI/CD automatisé avec GitHub Actions
- Dockerisation complète de la stack (frontend, backend, BDD)
- Déploiement sur un VPS distant avec vérification des services via healthcheck
- Notification via webhook en cas de succès ou d'échec

## Architecture du projet

```
project-root/
│
├── front-end/                  # Application Angular (todo + gestion membres)
├── back-end/                   # API Node.js/Express (CRUD utilisateurs)
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── .github/workflows/ci-cd.yml
└── .env.template               # Modèle de variables d'environnement
```

## Technologies utilisées

| Côté | Stack |
|------|-------|
| **Frontend** | Angular 19, TypeScript |
| **Backend** | Node.js, Express, Sequelize, TypeScript |
| **Base de données** | MySQL (via Docker) |
| **CI/CD** | GitHub Actions |
| **Conteneurisation** | Docker, Docker Compose |
| **Monitoring** | Healthcheck HTTP + Webhook |
| **Sécurité** | GitHub Secrets, gestion des ports, backup auto |

## Équipe projet

| Nom | Rôle principal | Contributions clés |
|-----|----------------|-------------------|
| **Anas DAOUI** | Développeur Frontend Angular | Gestion des membres, routing, formulaires réactifs, cards |
| **Minh** | Git & CI/CD | Création des workflows GitHub Actions, structure Git |
| **Clément** | Base de données | Modélisation Sequelize, migrations, liaison BDD |
| **Émile** | Sécurité | GitHub Secrets, scan images, verrouillage des ports |
| **Nathan** | Développeur Backend Node.js | API REST, tests unitaires, gestion des routes, cards API |
| **Nicolas** | Conteneurisation (Docker) | Dockerfiles, Docker Compose, orchestration réseau |

> Tous les membres ont collaboré de manière transversale sur la validation des tests, l'intégration des environnements et les déploiements.

## Déploiement

Les environnements sont déployés automatiquement sur un VPS via SSH :

- **Staging** : http://212.83.130.245:81
- **Production** : http://212.83.130.245:80

### Attribution des ports

| Environnement | Frontend | Backend | PhpMyAdmin |
|---------------|----------|---------|------------|
| **Staging** | :81 | :3001 | :8081 |
| **Production** | :80 | :3000 | :8080 |

### Production : Préparation et lancement

#### 1. Nettoyage des fichiers générés
```bash
git clean -ixd
```
> Supprime les fichiers non versionnés (par exemple : `var/`, `jwt/`) pour éviter qu'ils contaminent l'image de production.

#### 2. Configuration des variables d'environnement
Avant tout déploiement en production, modifier les identifiants de la base de données et autres variables sensibles dans le fichier `.env`.

#### 3. Lancement
```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml \
up \
-d \
--build
```

## CI/CD Pipeline (GitHub Actions)

Le pipeline `ci-cd.yml` (voir `.github/workflows/`) gère les étapes suivantes :

1. **test_webhook** : test de connectivité webhook
2. **backend_tests** : build et tests unitaires backend
3. **perf_tests** : tests de performance automatisés
4. **e2e_tests** : tests end-to-end (planifiés chaque soir à 22h)
5. **deploy_staging** : déploiement sur environnement de test
6. **deploy_production** : déploiement final
7. **notify_webhook_*** : notification webhook (succès ou échec)

### Déclencheurs

```yaml
on:
  push:
    branches: ["**"]
  pull_request:
    branches: ["**"]
  schedule:
    - cron: "0 22 * * *"
```

> Un aperçu graphique du pipeline est disponible dans l'onglet "Actions" du dépôt.

## Développement local

### Développement conteneurisé (recommandé)

```bash
docker compose up -d --build
```

> Le fichier `docker-compose.override.yml` est automatiquement pris en compte pour la configuration locale.

### Développement classique

**Backend :**
```bash
cd back-end
npm install
npm run dev
```

**Frontend :**
```bash
cd front-end
npm install
ng serve
```

> Possibilité de développement dans conteneur Docker directement via VSCode en utilisant l'extension "Remote Development" > "Attach to Running Container...".

## Bonnes pratiques Git

- **Convention de nommage des branches** : `feature/*`, `fix/*`, `main`, `develop`
- **Intégration via Pull Requests**
- **Commits clairs, fréquents et formatés**
- **Aucun secret dans le code**, uniquement dans GitHub Secrets

## Sécurité et Monitoring

- **Webhook** : https://webhook.site/ffed736a-8eec-4ddb-818d-c1ae3e2c8648
- **Healthcheck** : `/health` sur chaque API
- **Notifications webhook** : succès/échec de chaque étape critique
- **Fermeture de ports non utilisés** via `fuser` et `ss`
- **Backups MySQL** réalisés avec `mysqldump`
- **Secrets et configuration sécurisée** via GitHub Secrets

## Notes supplémentaires

- Attribution dynamique des ports lors du déploiement
- Redémarrage automatique en cas d'échec (jusqu'à 3 tentatives)
- Backup automatique de la base de données avant chaque mise en production

## Liens utiles

- **Dépôt GitHub** : [DevOps_CICD](https://github.com/username/DevOps_CICD)
- **Environnement Staging** : http://212.83.130.245:81
- **Environnement Production** : http://212.83.130.245:80

---

> **Avertissement** : Projet réalisé dans un cadre pédagogique. Ne pas utiliser en production sans audit de sécurité préalable.