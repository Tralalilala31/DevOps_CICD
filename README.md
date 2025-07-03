# CICD

## Environnements disponibles

| Environnement   | Description                          | Utilisation                              | Frontend | Backend | PhpMyAdmin |
| --------------- | ------------------------------------ | ---------------------------------------- | -------- | ------- | ---------- |
| **Development** | Développement local avec hot-reload  | Développement et debug                   | `82`     | `3002`  | `8082`     |
| **Staging**     | Environnement de test pré-production | Tests d'intégration et validation        | `81`     | `3001`  | `8081`     |
| **Production**  | Environnement de production          | Application finale pour les utilisateurs | `80`     | `3000`  | `8080`     |

## Production

### Nettoyage des fichiers

Si le projet a été lancé en mode développement, il faut nettoyer les fichiers générés pour qu'ils n'entrent pas dans le build de production.

```bash
git clean -ixd  # Supprime les fichiers non versionnés (var/, jwt/, etc.)
```

> Cette étape est cruciale pour éviter que des fichiers de dev ne contaminent l'image de production

### Modification des identifiants de la BDD

Les variables de la base de données (dans `.env` à la racine du projet) doivent être modifiées avant de lancer l'application en production, car celles-ci ne sont pas sécurisées.

### Lancement

Tout le projet est inclus dans des conteneurs Docker donc les fichiers ne sont pas mis à jour. Un build est obligatoire pour les remettre à jour (option `--build`).

```bash
docker compose \
-f compose.yml \
-f compose.prod.yml \
up \
-d \
--build
```

## Développement local

Pour développer, 2 possibilités :

- Développer en local : l'installation en local de npm est nécessaires.
- Développement conteneurisé sur VSCode via l'extension "Remote Development" > "Attach to Running Container...".

Créer les containers (utilise compose et compose.override) :

```bash
docker compose \
up \
-d \
--build
```

Contrairement à la production, il n'est pas nécessaire de spécifier les fichiers compose, car le fichier `docker-compose.override.yml` est pris en compte par défaut.

## Staging (pré production)

Pour le staging, il faut utiliser le fichier `compose.staging.yml` qui est une copie du fichier de production mais sans redémarrage des services. Cela permet de mieux déboguer en pré-production.

```bash
docker compose \
-f compose.yml \
-f compose.staging.yml \
up \
-d \
--build
```
