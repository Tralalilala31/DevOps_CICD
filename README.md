# DevOps CI/CD – Gestion des Membres

## Cadre pédagogique

Ce projet a été réalisé dans le cadre du cours **Intégration Déploiement** à **Ynov Campus Toulouse**, au sein de la promotion **MAST1 DEVLMIOT**, sous la supervision de **Monsieur ALLAINMAT**.

L'objectif pédagogique est de maîtriser les processus CI/CD, la contenerisation Docker, et l'automatisation des tests et déploiements sur serveur distant via GitHub Actions.

## Objectif du projet

Le projet consiste à étendre une application Angular existante pour y intégrer une gestion complète des membres (ajout, édition, suppression) via un backend Node.js et une base MySQL, avec les objectifs suivants :

- Mise en place d'une architecture microservices en conteneurs.
- Gestion de la base de données via `Sequelize`.
- Création d'un pipeline CI/CD automatisé avec `GitHub Actions`.
- Conteneurisation complète de la stack via Docker (frontend, backend, BDD) avec vérification des services via `Healthchecks`.
- Déploiement sur un VPS distant.
- Notification via webhook en cas de succès ou d'échec.

## Architecture du projet

```
project-root/
│
├── .github/workflows/ci-cd.yml # Workflows CI/CD Github Actions
├── front-end/                  # Application Angular (todo + gestion membres)
├── back-end/                   # API Node.js/Express (CRUD utilisateurs)
├── compose.yml                 # Configuration Docker Compose principale
├── compose.override.yml        # Configuration additionnelle pour le développement local
├── compose.prod.yml            # Configuration additionnelle pour la production
├── compose.staging.yml         # Configuration additionnelle pour le staging (pré-production)
├── compose.testing.yml         # Configuration additionnelle pour le testing
└── .env.                       # Variables d'environnement
```

## Technologies utilisées

| Côté                 | Stack                                           |
| -------------------- | ----------------------------------------------- |
| **Frontend**         | Angular, TypeScript                             |
| **Backend**          | Node.js, TypeScript, Express, Sequelize         |
| **Base de données**  | MySQL avec PHPMyAdmin                           |
| **CI/CD**            | GitHub Actions                                  |
| **Conteneurisation** | Docker (compose)                                |
| **Monitoring**       | Healthcheck Docker + Webhook                    |
| **Sécurité**         | GitHub Secrets, gestion des ports, back-up auto |

## Équipe projet

| Nom            | Rôle principal               | Contributions clés                                        |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| **Anas DAOUI** | Développeur Frontend Angular | Gestion des membres, routing, formulaires réactifs, cards |
| **Minh**       | Git & CI/CD                  | Création des workflows GitHub Actions, structure Git      |
| **Clément**    | Base de données              | Modélisation Sequelize, migrations, liaison BDD           |
| **Émile**      | Sécurité                     | GitHub Secrets, scan images, verrouillage des ports       |
| **Nathan**     | Développeur Backend Node.js  | API REST, tests unitaires, gestion des routes, cards API  |
| **Nicolas**    | Conteneurisation (Docker)    | Dockerfiles, Docker Compose, orchestration réseau         |

> Tous les membres ont collaboré de manière transversale sur la validation des tests, l'intégration des environnements et les déploiements.

## Déploiement

Les environnements sont déployés automatiquement sur un VPS via SSH. Adresse IP : <http://212.83.130.245> (ou <http://cicd.nicolas-delahaie.fr>)

### Modifier les ports à exposer

Les ports par défaut, pour le développement local (plug and play) sont :

| Environnement     | Frontend | Backend | PhpMyAdmin |
| ----------------- | -------- | ------- | ---------- |
| **Développement** | 82.      | 3002.   | 8082       |

Avant le déploiement, il est recommandé de modifier les ports à utiliser en fonction de l'environnement (dans le .env). Voici les valeurs recommandées, utilisées par le pipeline CI/CD :

| Environnement  | Frontend | Backend | PhpMyAdmin |
| -------------- | -------- | ------- | ---------- |
| **Production** | 80       | 3000    | 8080       |
| **Staging**    | 81       | 3001    | 8081       |

> Par exemple pour accéder au fontend en staging : <http://cicd.nicolas-delahaie.fr:81>

### Nettoyage des fichiers générés

```bash
git clean -ixd
```

> Supprime les fichiers non versionnés (par exemple : `var/`, `jwt/`) pour éviter qu'ils contaminent l'image de production.

### Configuration des variables d'environnement

Avant tout déploiement en production, modifier les identifiants de la base de données et autres variables sensibles dans le fichier `.env`.

### Lancement

```bash
docker compose \
-f compose.yml \
-f compose.<ENVIRONNEMENT_SOUHAITE>.yml \
up \
-d \
--build
```

## CI/CD Pipeline (GitHub Actions)

Le projet utilise **deux pipelines automatisés** (voir `.github/workflows/`) :

### 1. Pipeline de déploiement

Déclenché automatiquement lors des merges sur les branches principales :

- **Validation** : tests unitaires, vérification des secrets, connectivité
- **Déploiement staging** : environnement de pré-production pour validation
- **Déploiement production** : mise en ligne finale après validation
- **Notifications** : webhook de succès ou d'échec

### 2. Pipeline de tests périodiques

Exécuté automatiquement **chaque soir à 22h** :

- **Tests end-to-end** : validation complète des fonctionnalités
- **Tests de performance** : vérification des temps de réponse
- **Contrôle qualité** : surveillance continue de l'application

### Déclencheurs

- **Push/Pull Request** : validation et déploiement automatique
- **Planification** : tests nocturnes de surveillance (22h)
- **Manuel** : possibilité de lancer les workflows à la demande

> Les pipelines intègrent des mécanismes de blocage automatique en cas d'échec des tests critiques.

## Développement local

### Développement conteneurisé (recommandé)

```bash
docker compose up -d --build
```

> Le fichier `compose.override.yml` est automatiquement pris en compte pour la configuration locale.

> Possibilité de développement dans conteneur Docker directement via VSCode en utilisant l'extension "Remote Development" > "Attach to Running Container...".

## Bonnes pratiques Git

- **Convention de nommage des branches** : `feature/*`, `fix/*`, `main`, `develop`
- **Intégration via Pull Requests**
- **Commits clairs, fréquents et formatés**
- **Aucun secret dans le code**, uniquement dans GitHub Secrets

## Sécurité et Monitoring

- **Webhook** : https://webhook.site/36bbf972-8fcc-4e06-ae64-2f9b2c583cdd
- **Healthcheck** : `/health` sur chaque API
- **Notifications webhook** : succès/échec de chaque étape critique
- **Backups MySQL** réalisés par le biais de dumps
- **Secrets et configuration sécurisée** via GitHub Secrets

> **Avertissement** : Projet réalisé dans un cadre pédagogique. Ne pas utiliser en production sans audit de sécurité préalable.
