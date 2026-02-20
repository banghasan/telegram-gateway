#!/bin/bash
URL=${URL:-http://localhost:11000}
ID=${ID:-213567634}
PHOTO=${PHOTO:-"https://avatars.githubusercontent.com/u/5436959?v=1"}
CAPTION=${CAPTION:-"Foto bangHasan"}
PARSE_MODE=${PARSE_MODE:-Markdown}
API_KEY=${API_KEY:-}

curl -X POST "$URL/sendPhoto" \
  -H "Content-Type: application/json" \
  ${API_KEY:+-H "X-API-Key: $API_KEY"} \
  -d "{
    \"chat_id\": \"$ID\",
    \"photo\": \"$PHOTO\",
    \"caption\": \"$CAPTION\",
    \"parse_mode\": \"$PARSE_MODE\"
  }"
