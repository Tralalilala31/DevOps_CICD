#!/bin/sh

set -euo pipefail

WEATHER_API_KEY=5ccad1686b1549b992d70017250602
TARGET_FILE=src/environments/environment.$NODE_ENV.ts

# Choix du nom du fichier à générer
if [ "$NODE_ENV" = "production" ]; then
  PROD_VALUE=true
else
  PROD_VALUE=false
fi

# Génération du fichier TypeScript
echo "// GENERATED FIILE - DO NOT EDIT
export const environment = {
  production: $PROD_VALUE,
  apiUrl: '$API_URL',
  weatherApiKey: '$WEATHER_API_KEY'
};" > $TARGET_FILE

echo "✅ Fichier généré : $TARGET_FILE"
