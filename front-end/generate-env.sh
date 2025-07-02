#!/bin/sh

set -euo pipefail

WEATHER_API_KEY=5ccad1686b1549b992d70017250602 # Ne devrait pas etre hardcode, mais ca l'etait deja dans le projet initial
FILE_DIR=src/environments/
FILE_NAME=environment.ts
FILE=$FILE_DIR$FILE_NAME

if [ "$NODE_ENV" = "production" ]; then
  PROD_VALUE=true
else
  PROD_VALUE=false
fi

mkdir -p $FILE_DIR
echo "// GENERATED FILE WITH DOCKER - DO NOT EDIT
export const environment = {
  production: $PROD_VALUE,
  apiUrl: 'http://localhost:$API_PORT/api',
  weatherApiKey: '$WEATHER_API_KEY'
};" > $FILE

echo "Fichier d'environnement généré : $FILE"
